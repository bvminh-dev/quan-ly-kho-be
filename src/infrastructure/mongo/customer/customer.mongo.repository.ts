import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model, Types } from 'mongoose';
import type { CustomerEntity } from '../../../domain/customer/customer.entity.js';
import type { ICustomerRepository } from '../../../domain/customer/customer.repository.js';
import { CustomerMapper } from './customer.mapper.js';
import { Customer, CustomerDocument } from './customer.schema.js';

@Injectable()
export class CustomerMongoRepository implements ICustomerRepository {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async findById(id: string): Promise<CustomerEntity | null> {
    const doc = await this.customerModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return CustomerMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<CustomerEntity | null> {
    const doc = await this.customerModel
      .findOne({ name, isDeleted: false })
      .lean();
    return CustomerMapper.toDomain(doc);
  }

  async create(customer: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const created = await this.customerModel.create(customer as any);
    return CustomerMapper.toDomain(created) as CustomerEntity;
  }

  async update(
    id: string,
    data: Partial<CustomerEntity>,
  ): Promise<CustomerEntity | null> {
    const updated = await this.customerModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return CustomerMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.customerModel.findOneAndUpdate(
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
    const total = await this.customerModel.countDocuments(finalFilter);
    const pages = Math.ceil(total / pageSize);

    const docs = await this.customerModel
      .find(finalFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: CustomerMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }
}
