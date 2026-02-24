import { HistoryExportEntity } from '../../../domain/history-warehouse/history-export.entity.js';

export class HistoryExportMapper {
  static toDomain(doc: any): HistoryExportEntity | null {
    if (!doc) return null;

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

    const orderId =
      typeof doc.orderId === 'object' && doc.orderId !== null
        ? {
            _id: doc.orderId._id?.toString(),
            type: doc.orderId.type,
            state: doc.orderId.state,
            totalPrice: doc.orderId.totalPrice,
            payment: doc.orderId.payment,
            customer: doc.orderId.customer,
            note: doc.orderId.note,
            products: doc.orderId.products,
          }
        : doc.orderId?.toString() || doc.orderId;

    return new HistoryExportEntity({
      _id: doc._id.toString(),
      warehouseId,
      item: doc.item,
      inches: doc.inches,
      quality: doc.quality,
      style: doc.style,
      color: doc.color,
      priceHigh: doc.priceHigh,
      priceLow: doc.priceLow,
      sale: doc.sale,
      orderId,
      type: doc.type,
      priceOrder: doc.priceOrder,
      saleOrder: doc.saleOrder,
      quantityOrder: doc.quantityOrder,
      stateOrder: doc.stateOrder,
      paymentOrder: doc.paymentOrder,
      note: doc.note,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): HistoryExportEntity[] {
    return docs
      .map((doc) => HistoryExportMapper.toDomain(doc))
      .filter(Boolean) as HistoryExportEntity[];
  }
}
