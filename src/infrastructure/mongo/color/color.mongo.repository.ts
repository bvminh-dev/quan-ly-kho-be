import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { ColorEntity } from '../../../domain/color/color.entity.js';
import type { IColorRepository } from '../../../domain/color/color.repository.js';
import { ColorMapper } from './color.mapper.js';
import { Color, ColorDocument } from './color.schema.js';

@Injectable()
export class ColorMongoRepository implements IColorRepository {
  constructor(
    @InjectModel(Color.name)
    private readonly colorModel: Model<ColorDocument>,
  ) {}

  async findById(id: string): Promise<ColorEntity | null> {
    const doc = await this.colorModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return ColorMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<ColorEntity | null> {
    const doc = await this.colorModel
      .findOne({ code, isDeleted: false })
      .lean();
    return ColorMapper.toDomain(doc);
  }

  async create(data: Partial<ColorEntity>): Promise<ColorEntity> {
    const created = await this.colorModel.create(data as any);
    return ColorMapper.toDomain(created) as ColorEntity;
  }

  async update(
    id: string,
    data: Partial<ColorEntity>,
  ): Promise<ColorEntity | null> {
    const updated = await this.colorModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return ColorMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.colorModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.colorModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.colorModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: ColorMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
