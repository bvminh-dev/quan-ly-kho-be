import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import { OrderState } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';
import { computeOrderFinancials } from '../../../common/utils/order-financial.util.js';
import type { OrderEntity } from '../../../domain/order/order.entity.js';
import type { IOrderRepository } from '../../../domain/order/order.repository.js';
import { OrderMapper } from './order.mapper.js';
import { Order, OrderDocument } from './order.schema.js';

@Injectable()
export class OrderMongoRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) { }

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await this.orderModel
      .findOne({ _id: id, isDeleted: false })
      .populate('customer', '_id name payment')
      .populate('createdBy', '_id name')
      .lean();
    return OrderMapper.toDomain(doc);
  }

  async create(order: Partial<OrderEntity>): Promise<OrderEntity> {
    const created = await this.orderModel.create(order as any);
    const doc = await this.orderModel
      .findById(created._id)
      .populate('customer', '_id name payment')
      .populate('createdBy', '_id name')
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
      .populate('createdBy', '_id name')
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
        { path: 'createdBy', select: '_id name' },
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
      .populate('createdBy', '_id name')
      .lean();
    return OrderMapper.toDomain(updated);
  }

  async findForDashboard(
    startDate: Date,
    endDate: Date,
  ): Promise<OrderEntity[]> {
    const docs = await this.orderModel
      .find({
        isDeleted: false,
        state: OrderState.DA_GIAO,
        deliveredAt: { $gte: startDate, $lte: endDate },
      })
      .populate('customer', '_id name')
      .populate('createdBy', '_id name')
      .lean();
    return OrderMapper.toDomainList(docs);
  }

  async findLatestOrderIdsPerCustomer(
    customerIds: string[],
  ): Promise<Map<string, string>> {
    const results = await this.orderModel.aggregate<{
      _id: string;
      latestOrderId: string;
    }>([
      {
        $match: {
          customer: { $in: customerIds.map((id) => new Types.ObjectId(id)) },
          isDeleted: false,
          state: {
            $in: [OrderState.DA_CHOT.toString(), OrderState.DA_GIAO.toString()],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$customer',
          latestOrderId: { $first: '$_id' },
        },
      },
    ]);

    const map = new Map<string, string>();
    for (const r of results) {
      map.set(String(r._id), String(r.latestOrderId));
    }
    return map;
  }

  async calculateCustomerPayment(customerId: string): Promise<number> {
    const docs = await this.orderModel
      .find()
      .where('customer')
      .equals(customerId)
      .where('isDeleted')
      .equals(false)
      .where('state')
      .nin([OrderState.BAO_GIA])
      .lean()
      .exec();

    const orders = OrderMapper.toDomainList(docs);

    let totalOrderUSD = 0;
    let totalPaidUSD = 0;

    for (const order of orders) {
      // const financials = computeOrderFinancials(order);
      // totalOrderUSD = totalOrderUSD + financials.totalUSD;
      // totalPaidUSD = totalPaidUSD + financials.paidUSD;

      totalOrderUSD = totalOrderUSD + order.totalUsd;
      totalPaidUSD = totalPaidUSD + order.paidedUsd;
    }

    return roundToTwo(totalPaidUSD - totalOrderUSD);
  }
}
