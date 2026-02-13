import { WarehouseEntity } from '../../../domain/warehouse/warehouse.entity.js';

export class WarehouseMapper {
  static toDomain(doc: any): WarehouseEntity | null {
    if (!doc) return null;
    return new WarehouseEntity({
      _id: doc._id.toString(),
      inches: doc.inches,
      item: doc.item,
      quality: doc.quality,
      style: doc.style,
      color: doc.color,
      totalAmount: doc.totalAmount,
      amountOccupied: doc.amountOccupied,
      amountAvailable: doc.amountAvailable,
      unitOfCalculation: doc.unitOfCalculation,
      priceHigh: doc.priceHigh,
      priceLow: doc.priceLow,
      sale: doc.sale,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): WarehouseEntity[] {
    return docs.map((doc) => WarehouseMapper.toDomain(doc)).filter(Boolean) as WarehouseEntity[];
  }
}
