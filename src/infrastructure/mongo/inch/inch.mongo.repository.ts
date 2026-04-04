import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { InchEntity } from '../../../domain/inch/inch.entity.js';
import type { IInchRepository } from '../../../domain/inch/inch.repository.js';
import { InchMapper } from './inch.mapper.js';
import { Inch, InchDocument } from './inch.schema.js';

@Injectable()
export class InchMongoRepository implements IInchRepository {
  constructor(
    @InjectModel(Inch.name)
    private readonly inchModel: Model<InchDocument>,
  ) {}

  async findById(id: string): Promise<InchEntity | null> {
    const doc = await this.inchModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return InchMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<InchEntity | null> {
    const doc = await this.inchModel
      .findOne({ code, isDeleted: false })
      .lean();
    return InchMapper.toDomain(doc);
  }

  async create(data: Partial<InchEntity>): Promise<InchEntity> {
    const created = await this.inchModel.create(data as any);
    return InchMapper.toDomain(created) as InchEntity;
  }

  async update(
    id: string,
    data: Partial<InchEntity>,
  ): Promise<InchEntity | null> {
    const updated = await this.inchModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return InchMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.inchModel.findOneAndUpdate(
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
    const total = await this.inchModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.inchModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: InchMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
