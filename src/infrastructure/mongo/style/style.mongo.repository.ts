import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { StyleEntity } from '../../../domain/style/style.entity.js';
import type { IStyleRepository } from '../../../domain/style/style.repository.js';
import { StyleMapper } from './style.mapper.js';
import { Style, StyleDocument } from './style.schema.js';

@Injectable()
export class StyleMongoRepository implements IStyleRepository {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>,
  ) {}

  async findById(id: string): Promise<StyleEntity | null> {
    const doc = await this.styleModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return StyleMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<StyleEntity | null> {
    const doc = await this.styleModel
      .findOne({ code, isDeleted: false })
      .lean();
    return StyleMapper.toDomain(doc);
  }

  async create(data: Partial<StyleEntity>): Promise<StyleEntity> {
    const created = await this.styleModel.create(data as any);
    return StyleMapper.toDomain(created) as StyleEntity;
  }

  async update(
    id: string,
    data: Partial<StyleEntity>,
  ): Promise<StyleEntity | null> {
    const updated = await this.styleModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return StyleMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.styleModel.findOneAndUpdate(
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
    const total = await this.styleModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.styleModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: StyleMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
