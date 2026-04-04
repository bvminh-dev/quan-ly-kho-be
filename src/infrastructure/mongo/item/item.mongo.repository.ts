import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { ItemEntity } from '../../../domain/item/item.entity.js';
import type { IItemRepository } from '../../../domain/item/item.repository.js';
import { ItemMapper } from './item.mapper.js';
import { Item, ItemDocument } from './item.schema.js';

@Injectable()
export class ItemMongoRepository implements IItemRepository {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>,
  ) {}

  async findById(id: string): Promise<ItemEntity | null> {
    const doc = await this.itemModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return ItemMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<ItemEntity | null> {
    const doc = await this.itemModel
      .findOne({ code, isDeleted: false })
      .lean();
    return ItemMapper.toDomain(doc);
  }

  async create(data: Partial<ItemEntity>): Promise<ItemEntity> {
    const created = await this.itemModel.create(data as any);
    return ItemMapper.toDomain(created) as ItemEntity;
  }

  async update(
    id: string,
    data: Partial<ItemEntity>,
  ): Promise<ItemEntity | null> {
    const updated = await this.itemModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return ItemMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.itemModel.findOneAndUpdate(
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
    const total = await this.itemModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.itemModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: ItemMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
