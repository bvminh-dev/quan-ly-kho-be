import { Inject, Injectable, Logger } from '@nestjs/common';
import { UnitOfCalculation } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { computeOrderFinancials } from '../../common/utils/order-financial.util.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { DashboardQueryDto } from './dto/dashboard-query.dto.js';

interface CustomerAgg {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalOrdersKg: number;
  totalOrdersPcs: number;
  totalValueUSD: number;
  totalCollectedNGN: number;
  totalCollectedUSD: number;
}

@Injectable()
export class GetDashboardCustomersUseCase {
  private readonly logger = new Logger(GetDashboardCustomersUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IOrderRepository,
  ) { }

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
          totalCollectedNGN: 0,
          totalCollectedUSD: 0,
        });
      }

      const c = customerMap.get(customerId)!;
      c.totalOrders += 1;

      // Tính toán tài chính theo rule
      const financials = computeOrderFinancials(order);
      c.totalValueUSD += order.totalUsd;

      for (const product of order.products) {
        for (const item of product.items) {
          if (item.unitOfCalculation === UnitOfCalculation.KG.toString()) {
            c.totalOrdersKg += item.quantity;
          } else if (
            item.unitOfCalculation === UnitOfCalculation.PCS.toString()
          ) {
            c.totalOrdersPcs += item.quantity;
          }
        }
      }

      // Sử dụng giá trị đã trả từ hàm tính toán
      c.totalCollectedNGN += financials.paidNGN;
      c.totalCollectedUSD += financials.paidUSD;
    }

    return Array.from(customerMap.values()).map((c) => ({
      customerId: c.customerId,
      customerName: c.customerName,
      totalOrders: c.totalOrders,
      totalOrdersKg: roundToTwo(c.totalOrdersKg),
      totalOrdersPcs: roundToTwo(c.totalOrdersPcs),
      totalValueUSD: roundToTwo(c.totalValueUSD),
      totalCollectedNGN: roundToTwo(c.totalCollectedNGN),
      totalCollectedUSD: roundToTwo(c.totalCollectedUSD),
    }));
  }
}
