/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { UserEntity } from '../../../domain/user/user.entity.js';
import type { IUserRepository } from '../../../domain/user/user.repository.js';
import { UserMapper } from './user.mapper.js';
import { User, UserDocument } from './user.schema.js';

@Injectable()
export class UserMongoRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return UserMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.userModel
      .findOne({ email, isDeleted: false })
      .lean();
    return UserMapper.toDomain(doc);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
    const doc = await this.userModel
      .findOne({ refreshToken, isDeleted: false })
      .lean();
    return UserMapper.toDomain(doc);
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const created = await this.userModel.create(user as any);
    return UserMapper.toDomain(created) as UserEntity;
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const updated = await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return UserMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.userModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.userModel
      .find({ ...filter, isDeleted: false })
      .select('-password -refreshToken')
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([
        { path: 'role', select: '_id name' },
        ...(Array.isArray(population) ? population : []),
      ])
      .lean();

    return {
      items: UserMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { refreshToken },
    );
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments({ isDeleted: false });
  }
}
