import { UnitOfCalculation } from '../enums/index.js';
import type { OrderProductEntity } from '../../domain/order/order.entity.js';

/**
 * Tính tổng tiền USD của đơn hàng từ products.
 * - isCalcSet = true: giá 1 set = quantitySet × (priceSet − saleSet)
 * - isCalcSet = false: mỗi item = quantity × (price − sale)
 */
export function calcOrderTotalUsd(products: OrderProductEntity[]): number {
  let total = 0;
  for (const product of products) {
    if (product.isCalcSet) {
      total +=
        (product.quantitySet ?? 0) *
        ((product.priceSet ?? 0) - (product.saleSet ?? 0));
    } else {
      for (const item of product.items) {
        total += item.quantity * (item.price - item.sale);
      }
    }
  }
  return total;
}

/**
 * Đếm tổng số lượng theo đơn vị Kg và Pcs.
 * Khi isCalcSet = true, số lượng mỗi item được nhân thêm quantitySet.
 */
export function countItemQuantities(products: OrderProductEntity[]): {
  kg: number;
  pcs: number;
} {
  let kg = 0;
  let pcs = 0;
  for (const product of products) {
    const multiplier = product.isCalcSet ? (product.quantitySet ?? 1) : 1;
    for (const item of product.items) {
      const qty = item.quantity * multiplier;
      if (item.unitOfCalculation === UnitOfCalculation.KG) {
        kg += qty;
      } else if (item.unitOfCalculation === UnitOfCalculation.PCS) {
        pcs += qty;
      }
    }
  }
  return { kg, pcs };
}
