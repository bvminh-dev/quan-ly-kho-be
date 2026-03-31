import { OrderState, HistoryType } from '../enums/index.js';
import type {
  OrderEntity,
  OrderProductEntity,
  OrderHistoryEntity,
} from '../../domain/order/order.entity.js';
import { roundToTwo } from './number.util.js';

export interface OrderFinancials {
  totalUSD: number;
  totalNGN: number;
  paidUSD: number;
  paidNGN: number;
  remainingUSD: number;
  remainingNGN: number;
}

/**
 * Tính toán các giá trị tài chính cho đơn hàng theo rule
 * @param order Đơn hàng cần tính toán
 * @returns Object chứa tổng tiền, đã trả và còn lại (USD và NGN)
 */
export function computeOrderFinancials(order: OrderEntity): OrderFinancials {
  const exchangeRate = order.exchangeRate ?? 1;

  // Bước 1: Tính Subtotal và Discount từ Products
  let subtotalUSD = 0;
  let discountUSD = 0;

  for (const product of order.products) {
    const qtySet = product.quantitySet ?? 0;
    const hasSetMeta =
      !!product.nameSet ||
      (product.priceSet ?? 0) > 0 ||
      (product.saleSet ?? 0) > 0;
    const isSet = qtySet > 0 && (hasSetMeta || product.items.length > 1);
    const setQty = isSet ? Math.max(qtySet, 0) : 1;

    // Xác định cách tính (isCalcSet)
    const isCalcSet =
      isSet && ((product.priceSet ?? 0) > 0 || product.isCalcSet);

    if (isCalcSet) {
      // Tính theo giá set
      subtotalUSD += (product.priceSet ?? 0) * setQty;
      discountUSD += (product.saleSet ?? 0) * setQty;
    } else {
      // Tính theo tổng các items
      let itemsTotalUSD = 0;
      let itemsDiscountUSD = 0;

      for (const item of product.items) {
        itemsTotalUSD += item.price * item.quantity * setQty;
        itemsDiscountUSD += (item.sale ?? 0) * item.quantity * setQty;
      }

      subtotalUSD += itemsTotalUSD;
      discountUSD += itemsDiscountUSD;
    }
  }

  // Bước 2: Tính Tổng Tiền
  const baseTotalUSD = subtotalUSD - discountUSD;
  const debtUSD = order.debt ?? 0;
  const totalUSD = baseTotalUSD + debtUSD;
  const totalNGN = totalUSD * exchangeRate;

  // Bước 3: Tính Đã Trả (Paid)
  let paidUSD = 0;
  let paidNGN = 0;

  if (order.state === OrderState.BAO_GIA.toString()) {
    // Trạng thái "báo giá": sử dụng trường paid trực tiếp
    paidUSD = order.paid ?? 0;
    paidNGN = paidUSD * exchangeRate;
  } else {
    // Các trạng thái khác: tính từ lịch sử thanh toán
    // paidUSD và paidNGN được tính độc lập từ các trường tương ứng trong history
    const history = order.history ?? [];
    for (const h of history) {
      const historyType = h.type?.toLowerCase() ?? '';
      const isHoanTien = historyType === HistoryType.HOAN_TIEN.toLowerCase();
      const isKhachTra = historyType === HistoryType.KHACH_TRA.toLowerCase();

      if (isKhachTra) {
        // Khách trả: cộng vào
        paidUSD += h.paymentType === 'auto' ? 0 : (h.moneyPaidDolar ?? 0);
        paidNGN += h.paymentType === 'auto' ? 0 : (h.moneyPaidNGN ?? 0);
      } else if (isHoanTien) {
        // Hoàn tiền: trừ đi
        paidUSD -= h.moneyPaidDolar ?? 0;
        paidNGN -= h.moneyPaidNGN ?? 0;
      }
    }
  }

  // Bước 4: Tính Còn Lại (Remaining)
  const remainingUSD = totalUSD - paidUSD;
  const remainingNGN = remainingUSD * exchangeRate;

  return {
    totalUSD,
    totalNGN,
    paidUSD,
    paidNGN,
    remainingUSD,
    remainingNGN,
  };
}
