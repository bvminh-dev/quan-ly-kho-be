import { Inject, Injectable, Logger } from '@nestjs/common';
import { HistoryType } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { countItemQuantities } from '../../common/utils/order.util.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { DashboardQueryDto } from './dto/dashboard-query.dto.js';

interface CustomerAgg {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalOrdersKg: number;
  totalOrdersPcs: number;
  totalValueUSD: number;
  totalCollectedUSD: number;
  totalDebtUSD: number;
  totalValueNGN: number;
  totalCollectedNGN: number;
}

@Injectable()
export class GetDashboardCustomersUseCase {
  private readonly logger = new Logger(GetDashboardCustomersUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(query: DashboardQueryDto) {
    this.logger.log(
      `Dashboard customers: period=${query.period}, date=${query.date}`,
    );

    const { startDate, endDate } = getDateRange(query.period, query.date);
    const orders = await this.orderRepo.findForDashboard(startDate, endDate);

    const customerMap = new Map<string, CustomerAgg>();

    for (const order of orders) {
      const customerId =
        typeof order.customer === 'object' && order.customer
          ? order.customer._id
          : String(order.customer ?? '');
      const customerName =
        typeof order.customer === 'object' && order.customer
          ? order.customer.name
          : '';

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName,
          totalOrders: 0,
          totalOrdersKg: 0,
          totalOrdersPcs: 0,
          totalValueUSD: 0,
          totalCollectedUSD: 0,
          totalDebtUSD: 0,
          totalValueNGN: 0,
          totalCollectedNGN: 0,
        });
      }

      const c = customerMap.get(customerId)!;
      c.totalOrders += 1;

      const orderTotalUsd = (order.totalUsd ?? 0) + (order.debt ?? 0);
      const orderPaidedUsd = order.paidedUsd ?? 0;
      const orderExchangeRate = order.exchangeRate ?? 0;

      c.totalValueUSD += orderTotalUsd;
      c.totalCollectedUSD += orderPaidedUsd;
      c.totalDebtUSD += orderTotalUsd - orderPaidedUsd;
      c.totalValueNGN += orderTotalUsd * orderExchangeRate;

      const { kg, pcs } = countItemQuantities(order.products);
      c.totalOrdersKg += kg;
      c.totalOrdersPcs += pcs;

      for (const history of order.history ?? []) {
        if (history.type === HistoryType.KHACH_TRA) {
          c.totalCollectedNGN += history.moneyPaidNGN;
        } else if (history.type === HistoryType.HOAN_TIEN) {
          c.totalCollectedNGN -= history.moneyPaidNGN;
        }
      }
    }

    return Array.from(customerMap.values()).map((c) => ({
      customerId: c.customerId,
      customerName: c.customerName,
      totalOrders: c.totalOrders,
      totalOrdersKg: roundToTwo(c.totalOrdersKg),
      totalOrdersPcs: roundToTwo(c.totalOrdersPcs),
      totalValueUSD: roundToTwo(c.totalValueUSD),
      totalCollectedUSD: roundToTwo(c.totalCollectedUSD),
      totalDebtUSD: roundToTwo(c.totalDebtUSD),
      totalValueNGN: roundToTwo(c.totalValueNGN),
      totalCollectedNGN: roundToTwo(c.totalCollectedNGN),
    }));
  }
}
