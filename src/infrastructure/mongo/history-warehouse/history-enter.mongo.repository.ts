/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { HistoryEnterEntity } from '../../../domain/history-warehouse/history-enter.entity.js';
import type { IHistoryEnterRepository } from '../../../domain/history-warehouse/history-enter.repository.js';
import { HistoryEnterMapper } from './history-enter.mapper.js';
import { HistoryEnter, HistoryEnterDocument } from './history-enter.schema.js';

@Injectable()
export class HistoryEnterMongoRepository implements IHistoryEnterRepository {
  constructor(
    @InjectModel(HistoryEnter.name)
    private readonly historyEnterModel: Model<HistoryEnterDocument>,
  ) { }

  async findById(id: string): Promise<HistoryEnterEntity | null> {
    const doc = await this.historyEnterModel
      .findOne({ _id: id, isDeleted: false })
      .populate(
        'warehouseId',
        'item inches quality style color priceHigh priceLow sale totalAmount amountOccupied amountAvailable unitOfCalculation',
      )
      .populate(
        'metadata.orderId',
        'type state totalPrice payment customer note',
      )
      .lean();
    return HistoryEnterMapper.toDomain(doc);
  }

  async create(
    history: Partial<HistoryEnterEntity>,
  ): Promise<HistoryEnterEntity> {
    const created = await this.historyEnterModel.create(history as any);
    return HistoryEnterMapper.toDomain(created) as HistoryEnterEntity;
  }

  async update(
    id: string,
    data: Partial<HistoryEnterEntity>,
  ): Promise<HistoryEnterEntity | null> {
    const updated = await this.historyEnterModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return HistoryEnterMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.historyEnterModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    // Apply createdBy filter if user cannot view all data
    const finalFilter: any = {
      ...filter,
      isDeleted: false,
    };
    if (!canViewAllData && userId) {
      finalFilter.createdBy = new Types.ObjectId(userId);
    }

    const offset = (currentPage - 1) * pageSize;
    const total = await this.historyEnterModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.historyEnterModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: HistoryEnterMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
