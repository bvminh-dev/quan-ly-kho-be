import { OrderEntity } from '../../../domain/order/order.entity.js';

export class OrderMapper {
  static toDomain(doc: any): OrderEntity | null {
    if (!doc) return null;
    return new OrderEntity({
      _id: doc._id.toString(),
      type: doc.type,
      state: doc.state,
      exchangeRate: doc.exchangeRate,
      customer:
        doc.customer && typeof doc.customer === 'object' && doc.customer.name
          ? { _id: doc.customer._id.toString(), name: doc.customer.name }
          : doc.customer
            ? doc.customer.toString()
            : null,
      totalPrice: doc.totalPrice,
      payment: doc.payment,
      note: doc.note,
      products:
        doc.products?.map((p: any) => ({
          nameSet: p.nameSet,
          priceSet: p.priceSet,
          quantitySet: p.quantitySet,
          saleSet: p.saleSet,
          isCalcSet: p.isCalcSet,
          items:
            p.items?.map((i: any) => ({
              id: i.id?.toString?.() ?? i.id,
              quantity: i.quantity,
              price: i.price,
              sale: i.sale,
              customPrice: i.customPrice,
              customSale: i.customSale,
            })) ?? [],
        })) ?? [],
      history:
        doc.history?.map((h: any) => ({
          type: h.type,
          exchangeRate: h.exchangeRate,
          moneyPaidNGN: h.moneyPaidNGN,
          moneyPaidDolar: h.moneyPaidDolar,
          paymentMethod: h.paymentMethod,
          datePaid: h.datePaid,
          note: h.note,
        })) ?? [],
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
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
