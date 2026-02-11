import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { PermissionEntity } from '../../../domain/permission/permission.entity.js';
import type { IPermissionRepository } from '../../../domain/permission/permission.repository.js';
import { PermissionMapper } from './permission.mapper.js';
import { Permission, PermissionDocument } from './permission.schema.js';

@Injectable()
export class PermissionMongoRepository implements IPermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async findById(id: string): Promise<PermissionEntity | null> {
    const doc = await this.permissionModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return PermissionMapper.toDomain(doc);
  }

  async create(
    permission: Partial<PermissionEntity>,
  ): Promise<PermissionEntity> {
    const created = await this.permissionModel.create(permission as any);
    return PermissionMapper.toDomain(created) as PermissionEntity;
  }

  async update(
    id: string,
    data: Partial<PermissionEntity>,
  ): Promise<PermissionEntity | null> {
    const updated = await this.permissionModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return PermissionMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.permissionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.permissionModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.permissionModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .lean();

    return {
      items: PermissionMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }

  async count(): Promise<number> {
    return this.permissionModel.countDocuments({ isDeleted: false });
  }

  async insertMany(
    permissions: Partial<PermissionEntity>[],
  ): Promise<PermissionEntity[]> {
    const docs = await this.permissionModel.insertMany(permissions as any);
    return PermissionMapper.toDomainList(docs);
  }
}
