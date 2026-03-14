import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import type { WarehouseEntity } from '../../../domain/warehouse/warehouse.entity.js';
import type { IWarehouseRepository } from '../../../domain/warehouse/warehouse.repository.js';
import { WarehouseMapper } from './warehouse.mapper.js';
import { Warehouse, WarehouseDocument } from './warehouse.schema.js';

@Injectable()
export class WarehouseMongoRepository implements IWarehouseRepository {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async findById(id: string): Promise<WarehouseEntity | null> {
    const doc = await this.warehouseModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    return WarehouseMapper.toDomain(doc);
  }

  async findByAttributes(
    inchId: string,
    itemId: string,
    qualityId: string,
    styleId: string,
    colorId: string,
  ): Promise<WarehouseEntity | null> {
    const doc = await this.warehouseModel
      .findOne({
        inchId: inchId as any,
        itemId: itemId as any,
        qualityId: qualityId as any,
        styleId: styleId as any,
        colorId: colorId as any,
        isDeleted: false,
      })
      .lean();

    return WarehouseMapper.toDomain(doc);
  }

  async updateByCatalogId(
    field: 'inchId' | 'itemId' | 'qualityId' | 'styleId' | 'colorId',
    catalogId: string,
    nameField: 'inches' | 'item' | 'quality' | 'style' | 'color',
    newValue: string | number,
  ): Promise<void> {
    await this.warehouseModel.updateMany(
      { [field]: catalogId as any, isDeleted: false },
      { $set: { [nameField]: newValue } },
    );
  }

  async create(warehouse: Partial<WarehouseEntity>): Promise<WarehouseEntity> {
    const created = await this.warehouseModel.create(warehouse as any);
    return WarehouseMapper.toDomain(created) as WarehouseEntity;
  }

  async update(
    id: string,
    data: Partial<WarehouseEntity>,
  ): Promise<WarehouseEntity | null> {
    const updated = await this.warehouseModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data as any, {
        new: true,
      })
      .lean();
    return WarehouseMapper.toDomain(updated);
  }

  async softDelete(id: string, deleteBy: string): Promise<void> {
    await this.warehouseModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deleteBy },
    );
  }

  async findAll(queryString: string, currentPage: number, pageSize: number) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const total = await this.warehouseModel.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const pages = Math.ceil(total / pageSize);

    const docs = await this.warehouseModel
      .find({ ...filter, isDeleted: false })
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate([...(Array.isArray(population) ? population : [])])
      .lean();

    return {
      items: WarehouseMapper.toDomainList(docs),
      meta: {
        current: currentPage,
        pageSize,
        pages,
        total,
      },
    };
  }

  async updateStock(
    id: string,
    amountOccupiedDelta: number,
    amountAvailableDelta: number,
  ): Promise<WarehouseEntity | null> {
    const updated = await this.warehouseModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $inc: {
            amountOccupied: amountOccupiedDelta,
            amountAvailable: amountAvailableDelta,
          },
        },
        { new: true },
      )
      .lean();
    return WarehouseMapper.toDomain(updated);
  }

  async decreaseTotalAndOccupied(
    id: string,
    quantity: number,
    anyPaymetKhachTra: boolean,
  ): Promise<WarehouseEntity | null> {
    const updated = await this.warehouseModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $inc: {
            totalAmount: -quantity,
            amountAvailable: anyPaymetKhachTra ? 0 : -quantity,
            amountOccupied: anyPaymetKhachTra ? -quantity : 0,
          },
        },
        { new: true },
      )
      .lean();
    return WarehouseMapper.toDomain(updated);
  }
}
