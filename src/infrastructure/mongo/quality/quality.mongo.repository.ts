import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { QualityEntity } from '../../../domain/quality/quality.entity.js';
import type { IQualityRepository } from '../../../domain/quality/quality.repository.js';
import { QualityMapper } from './quality.mapper.js';
import { Quality, QualityDocument } from './quality.schema.js';

@Injectable()
export class QualityMongoRepository implements IQualityRepository {
  constructor(
    @InjectModel(Quality.name)
    private readonly qualityModel: Model<QualityDocument>,
  ) {}

  async findById(id: string): Promise<QualityEntity | null> {
    const doc = await this.qualityModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return QualityMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<QualityEntity | null> {
    const doc = await this.qualityModel
      .findOne({ code, isDeleted: false })
      .lean();
    return QualityMapper.toDomain(doc);
  }

  async create(data: Partial<QualityEntity>): Promise<QualityEntity> {
    const created = await this.qualityModel.create(data as any);
    return QualityMapper.toDomain(created) as QualityEntity;
  }

  async update(
    id: string,
    data: Partial<QualityEntity>,
  ): Promise<QualityEntity | null> {
    const updated = await this.qualityModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return QualityMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.qualityModel.findOneAndUpdate(
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
    const total = await this.qualityModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.qualityModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: QualityMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
