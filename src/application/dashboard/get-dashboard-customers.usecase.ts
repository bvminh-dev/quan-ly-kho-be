import { Inject, Injectable, Logger } from '@nestjs/common';
import { HistoryType, UnitOfCalculation } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { DashboardQueryDto } from './dto/dashboard-query.dto.js';

interface CustomerAgg {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalOrdersKg: number;
  totalOrdersPcs: number;
  totalPaidNGN: number;
  totalPaidUSD: number;
  totalValueUSD: number;
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
          totalPaidNGN: 0,
          totalPaidUSD: 0,
          totalValueUSD: 0,
        });
      }

      const c = customerMap.get(customerId)!;
      c.totalOrders += 1;
      c.totalValueUSD += order.totalUsd ?? 0;

      for (const product of order.products) {
        for (const item of product.items) {
          if (item.unitOfCalculation === UnitOfCalculation.KG) {
            c.totalOrdersKg += item.quantity;
          } else if (item.unitOfCalculation === UnitOfCalculation.PCS) {
            c.totalOrdersPcs += item.quantity;
          }
        }
      }

      for (const history of order.history ?? []) {
        if (history.type === HistoryType.KHACH_TRA) {
          c.totalPaidNGN += history.moneyPaidNGN;
          c.totalPaidUSD += history.moneyPaidDolar;
        } else if (history.type === HistoryType.HOAN_TIEN) {
          c.totalPaidNGN -= history.moneyPaidNGN;
          c.totalPaidUSD -= history.moneyPaidDolar;
        }
      }
    }

    return Array.from(customerMap.values()).map((c) => ({
      customerId: c.customerId,
      customerName: c.customerName,
      totalOrders: c.totalOrders,
      totalOrdersKg: roundToTwo(c.totalOrdersKg),
      totalOrdersPcs: roundToTwo(c.totalOrdersPcs),
      totalPaidNGN: roundToTwo(c.totalPaidNGN),
      totalPaidUSD: roundToTwo(c.totalPaidUSD),
      totalDebtUSD: roundToTwo(c.totalValueUSD - c.totalPaidUSD),
    }));
  }
}
