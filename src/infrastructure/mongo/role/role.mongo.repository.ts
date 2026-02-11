import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { RoleEntity } from '../../../domain/role/role.entity.js';
import type { IRoleRepository } from '../../../domain/role/role.repository.js';
import { RoleMapper } from './role.mapper.js';
import { Role, RoleDocument } from './role.schema.js';

@Injectable()
export class RoleMongoRepository implements IRoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findById(id: string): Promise<RoleEntity | null> {
    const doc = await this.roleModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return RoleMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const doc = await this.roleModel
      .findOne({ name, isDeleted: false })
      .lean();
    return RoleMapper.toDomain(doc);
  }

  async findByIdWithPopulate(id: string): Promise<RoleEntity | null> {
    const doc = await this.roleModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'permissions',
        select: '_id name apiPath method module',
      })
      .lean();
    return RoleMapper.toDomain(doc);
  }

  async create(role: Partial<RoleEntity>): Promise<RoleEntity> {
    const created = await this.roleModel.create(role as any);
    return RoleMapper.toDomain(created) as RoleEntity;
  }

  async update(
    id: string,
    data: Partial<RoleEntity>,
  ): Promise<RoleEntity | null> {
    const updated = await this.roleModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return RoleMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.roleModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.roleModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .lean();

    return {
      items: RoleMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }

  async count(): Promise<number> {
    return this.roleModel.countDocuments({ isDeleted: false });
  }
}
