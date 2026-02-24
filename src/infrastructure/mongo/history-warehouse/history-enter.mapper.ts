import { HistoryEnterEntity } from '../../../domain/history-warehouse/history-enter.entity.js';

export class HistoryEnterMapper {
  static toDomain(doc: any): HistoryEnterEntity | null {
    if (!doc) return null;

    const metadata = doc.metadata || {};
    if (metadata.orderId && typeof metadata.orderId === 'object') {
      metadata.orderId = {
        _id: metadata.orderId._id?.toString(),
        type: metadata.orderId.type,
        state: metadata.orderId.state,
        totalPrice: metadata.orderId.totalPrice,
        payment: metadata.orderId.payment,
        customer: metadata.orderId.customer,
        note: metadata.orderId.note,
      };
    } else if (metadata.orderId) {
      metadata.orderId = metadata.orderId.toString();
    }

    const warehouseId =
      typeof doc.warehouseId === 'object' && doc.warehouseId !== null
        ? {
            _id: doc.warehouseId._id?.toString(),
            item: doc.warehouseId.item,
            inches: doc.warehouseId.inches,
            quality: doc.warehouseId.quality,
            style: doc.warehouseId.style,
            color: doc.warehouseId.color,
            priceHigh: doc.warehouseId.priceHigh,
            priceLow: doc.warehouseId.priceLow,
            sale: doc.warehouseId.sale,
            totalAmount: doc.warehouseId.totalAmount,
            amountOccupied: doc.warehouseId.amountOccupied,
            amountAvailable: doc.warehouseId.amountAvailable,
          }
        : doc.warehouseId?.toString() || doc.warehouseId;

    return new HistoryEnterEntity({
      _id: doc._id.toString(),
      warehouseId,
      item: doc.item,
      inches: doc.inches,
      quality: doc.quality,
      style: doc.style,
      color: doc.color,
      type: doc.type,
      metadata,
      note: doc.note,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): HistoryEnterEntity[] {
    return docs
      .map((doc) => HistoryEnterMapper.toDomain(doc))
      .filter(Boolean) as HistoryEnterEntity[];
  }
}
