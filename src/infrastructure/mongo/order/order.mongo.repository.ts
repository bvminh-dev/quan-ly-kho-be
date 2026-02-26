import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import { HistoryType, OrderState } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';
import type { OrderEntity } from '../../../domain/order/order.entity.js';
import type { IOrderRepository } from '../../../domain/order/order.repository.js';
import { OrderMapper } from './order.mapper.js';
import { Order, OrderDocument } from './order.schema.js';

@Injectable()
export class OrderMongoRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await this.orderModel
      .findOne({ _id: id, isDeleted: false })
      .populate('customer', '_id name payment')
      .lean();
    return OrderMapper.toDomain(doc);
  }

  async create(order: Partial<OrderEntity>): Promise<OrderEntity> {
    const created = await this.orderModel.create(order as any);
    const doc = await this.orderModel
      .findById(created._id)
      .populate('customer', '_id name payment')
      .lean();
    return OrderMapper.toDomain(doc) as OrderEntity;
  }

  async update(
    id: string,
    data: Partial<OrderEntity>,
  ): Promise<OrderEntity | null> {
    const updated = await this.orderModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .populate('customer', '_id name payment')
      .lean();
    return OrderMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.orderModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.orderModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.orderModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([
        { path: 'customer', select: '_id name payment' },
        ...(Array.isArray(population) ? population : []),
      ])
      .lean();

    return {
      items: OrderMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }

  async addHistory(id: string, history: any): Promise<OrderEntity | null> {
    const updated = await this.orderModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $push: { history } },
        { new: true },
      )
      .populate('customer', '_id name payment')
      .lean();
    return OrderMapper.toDomain(updated);
  }

  async calculateCustomerPayment(customerId: string): Promise<number> {
    type OrderForPayment = {
      totalPrice?: number;
      exchangeRate?: number;
      history?: Array<{
        type?: HistoryType | string;
        moneyPaidDolar?: number;
      }>;
    };

    const orders = (await this.orderModel
      .find()
      .where('customer')
      .equals(customerId)
      .where('isDeleted')
      .equals(false)
      .where('state')
      .nin([OrderState.BAO_GIA, OrderState.HOAN_TAC])
      .select(['totalPrice', 'exchangeRate', 'history', 'state'])
      .lean()
      .exec()) as OrderForPayment[];

    let totalOrderUSD = 0;
    let totalPaidUSD = 0;

    for (const order of orders) {
      if (order.exchangeRate && order.exchangeRate > 0 && order.totalPrice) {
        totalOrderUSD = roundToTwo(
          totalOrderUSD + order.totalPrice / order.exchangeRate,
        );
      }

      const historyList = Array.isArray(order.history) ? order.history : [];

      for (const history of historyList) {
        if (history.type === HistoryType.KHACH_TRA) {
          totalPaidUSD = roundToTwo(
            totalPaidUSD + (history.moneyPaidDolar ?? 0),
          );
        } else if (history.type === HistoryType.HOAN_TIEN) {
          totalPaidUSD = roundToTwo(
            totalPaidUSD - (history.moneyPaidDolar ?? 0),
          );
        }
      }
    }

    return roundToTwo(totalPaidUSD - totalOrderUSD);
  }
}
