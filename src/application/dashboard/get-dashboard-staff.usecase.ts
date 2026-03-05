import { Inject, Injectable, Logger } from '@nestjs/common';
import { HistoryType, UnitOfCalculation } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { DashboardQueryDto } from './dto/dashboard-query.dto.js';

interface StaffAgg {
  staffId: string;
  staffName: string;
  totalOrders: number;
  totalOrdersKg: number;
  totalOrdersPcs: number;
  customerSet: Set<string>;
  totalValueUSD: number;
  totalCollectedNGN: number;
  totalCollectedUSD: number;
}

@Injectable()
export class GetDashboardStaffUseCase {
  private readonly logger = new Logger(GetDashboardStaffUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(query: DashboardQueryDto) {
    this.logger.log(
      `Dashboard staff: period=${query.period}, date=${query.date}`,
    );

    const { startDate, endDate } = getDateRange(query.period, query.date);
    const orders = await this.orderRepo.findForDashboard(startDate, endDate);

    const staffMap = new Map<string, StaffAgg>();

    for (const order of orders) {
      const staffId =
        typeof order.createdBy === 'object' && order.createdBy
          ? order.createdBy._id
          : String(order.createdBy ?? '');
      const staffName =
        typeof order.createdBy === 'object' && order.createdBy
          ? order.createdBy.name
          : '';

      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staffId,
          staffName,
          totalOrders: 0,
          totalOrdersKg: 0,
          totalOrdersPcs: 0,
          customerSet: new Set<string>(),
          totalValueUSD: 0,
          totalCollectedNGN: 0,
          totalCollectedUSD: 0,
        });
      }

      const s = staffMap.get(staffId)!;
      s.totalOrders += 1;

      const customerId =
        typeof order.customer === 'object' && order.customer
          ? order.customer._id
          : String(order.customer ?? '');
      s.customerSet.add(customerId);

      s.totalValueUSD += order.totalUsd ?? 0;

      for (const product of order.products) {
        for (const item of product.items) {
          if (item.unitOfCalculation === UnitOfCalculation.KG) {
            s.totalOrdersKg += item.quantity;
          } else if (item.unitOfCalculation === UnitOfCalculation.PCS) {
            s.totalOrdersPcs += item.quantity;
          }
        }
      }

      for (const history of order.history ?? []) {
        if (history.type === HistoryType.KHACH_TRA) {
          s.totalCollectedNGN += history.moneyPaidNGN;
          s.totalCollectedUSD += history.moneyPaidDolar;
        } else if (history.type === HistoryType.HOAN_TIEN) {
          s.totalCollectedNGN -= history.moneyPaidNGN;
          s.totalCollectedUSD -= history.moneyPaidDolar;
        }
      }
    }

    return Array.from(staffMap.values()).map((s) => ({
      staffId: s.staffId,
      staffName: s.staffName,
      totalOrders: s.totalOrders,
      totalOrdersKg: roundToTwo(s.totalOrdersKg),
      totalOrdersPcs: roundToTwo(s.totalOrdersPcs),
      totalCustomers: s.customerSet.size,
      totalValueUSD: roundToTwo(s.totalValueUSD),
      totalCollectedNGN: roundToTwo(s.totalCollectedNGN),
      totalCollectedUSD: roundToTwo(s.totalCollectedUSD),
    }));
  }
}
