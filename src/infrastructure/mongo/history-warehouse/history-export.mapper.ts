import { HistoryExportEntity } from '../../../domain/history-warehouse/history-export.entity.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

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
            priceHigh: roundToTwo(doc.warehouseId.priceHigh),
            priceLow: roundToTwo(doc.warehouseId.priceLow),
            sale: roundToTwo(doc.warehouseId.sale),
            totalAmount: roundToTwo(doc.warehouseId.totalAmount),
            amountOccupied: roundToTwo(doc.warehouseId.amountOccupied),
            amountAvailable: roundToTwo(doc.warehouseId.amountAvailable),
          }
        : doc.warehouseId?.toString() || doc.warehouseId;

    const orderId =
      typeof doc.orderId === 'object' && doc.orderId !== null
        ? {
            _id: doc.orderId._id?.toString(),
            type: doc.orderId.type,
            state: doc.orderId.state,
            totalPrice: roundToTwo(doc.orderId.totalPrice),
            payment: roundToTwo(doc.orderId.payment),
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
      priceHigh: roundToTwo(doc.priceHigh),
      priceLow: roundToTwo(doc.priceLow),
      sale: roundToTwo(doc.sale),
      unitOfCalculation: doc.unitOfCalculation,
      orderId,
      type: doc.type,
      priceOrder: roundToTwo(doc.priceOrder),
      saleOrder: roundToTwo(doc.saleOrder),
      quantityOrder: roundToTwo(doc.quantityOrder),
      stateOrder: doc.stateOrder,
      paymentOrder: roundToTwo(doc.paymentOrder),
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
