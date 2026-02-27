import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { HistoryExportEntity } from '../../../domain/history-warehouse/history-export.entity.js';
import type { IHistoryExportRepository } from '../../../domain/history-warehouse/history-export.repository.js';
import { HistoryExportMapper } from './history-export.mapper.js';
import {
  HistoryExport,
  HistoryExportDocument,
} from './history-export.schema.js';

@Injectable()
export class HistoryExportMongoRepository implements IHistoryExportRepository {
  constructor(
    @InjectModel(HistoryExport.name)
    private readonly historyExportModel: Model<HistoryExportDocument>,
  ) {}

  async findById(id: string): Promise<HistoryExportEntity | null> {
    const doc = await this.historyExportModel
      .findOne({ _id: id, isDeleted: false })
      .populate(
        'warehouseId',
        'item inches quality style color priceHigh priceLow sale totalAmount amountOccupied amountAvailable',
      )
      .populate(
        'orderId',
        'type state totalPrice payment customer note products',
      )
      .lean();
    return HistoryExportMapper.toDomain(doc);
  }

  async create(
    history: Partial<HistoryExportEntity>,
  ): Promise<HistoryExportEntity> {
    const created = await this.historyExportModel.create(history as any);
    return HistoryExportMapper.toDomain(created) as HistoryExportEntity;
  }

  async update(
    id: string,
    data: Partial<HistoryExportEntity>,
  ): Promise<HistoryExportEntity | null> {
    const updated = await this.historyExportModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return HistoryExportMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.historyExportModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.historyExportModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.historyExportModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: HistoryExportMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
