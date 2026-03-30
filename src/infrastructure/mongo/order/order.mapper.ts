import { roundToTwo } from '../../../common/utils/number.util.js';
import { OrderEntity } from '../../../domain/order/order.entity.js';

export class OrderMapper {
  static toDomain(doc: any): OrderEntity | null {
    if (!doc) return null;
    return new OrderEntity({
      _id: doc._id.toString(),
      type: doc.type,
      state: doc.state,
      exchangeRate: roundToTwo(doc.exchangeRate),
      customer:
        doc.customer && typeof doc.customer === 'object' && doc.customer.name
          ? { _id: doc.customer._id.toString(), name: doc.customer.name }
          : doc.customer
            ? doc.customer.toString()
            : null,
      totalUsd: roundToTwo(doc.totalUsd),
      paidedUsd: roundToTwo(doc.paidedUsd),
      debt: roundToTwo(doc.debt),
      paid: roundToTwo(doc.paid),
      note: doc.note,
      products:
        doc.products?.map((p: any) => ({
          nameSet: p.nameSet,
          priceSet: p.priceSet != null ? roundToTwo(p.priceSet) : undefined,
          quantitySet:
            p.quantitySet != null ? roundToTwo(p.quantitySet) : undefined,
          saleSet: p.saleSet != null ? roundToTwo(p.saleSet) : undefined,
          isCalcSet: p.isCalcSet,
          items:
            p.items?.map((i: any) => ({
              id: i.id?.toString?.() ?? i.id,
              quantity: roundToTwo(i.quantity),
              price: roundToTwo(i.price),
              sale: roundToTwo(i.sale),
              customPrice: i.customPrice,
              customSale: i.customSale,
              unitOfCalculation: i.unitOfCalculation,
            })) ?? [],
        })) ?? [],
      history:
        doc.history?.map((h: any) => ({
          type: h.type,
          exchangeRate: roundToTwo(h.exchangeRate),
          moneyPaidNGN: roundToTwo(h.moneyPaidNGN),
          moneyPaidDolar: roundToTwo(h.moneyPaidDolar),
          paymentMethod: h.paymentMethod,
          datePaid: h.datePaid,
          note: h.note,
          paymentType: h.paymentType,
        })) ?? [],
      createdBy:
        doc.createdBy && typeof doc.createdBy === 'object' && doc.createdBy.name
          ? { _id: doc.createdBy._id.toString(), name: doc.createdBy.name }
          : doc.createdBy
            ? doc.createdBy.toString()
            : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): OrderEntity[] {
    return docs
      .map((doc) => OrderMapper.toDomain(doc))
      .filter(Boolean) as OrderEntity[];
  }
}
