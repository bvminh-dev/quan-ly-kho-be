import { Inject, Injectable, Logger } from '@nestjs/common';
import { HistoryType, UnitOfCalculation } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { DashboardQueryDto } from './dto/dashboard-query.dto.js';

@Injectable()
export class GetDashboardOrdersUseCase {
  private readonly logger = new Logger(GetDashboardOrdersUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(query: DashboardQueryDto) {
    this.logger.log(
      `Dashboard orders: period=${query.period}, date=${query.date}`,
    );

    const { startDate, endDate } = getDateRange(query.period, query.date);
    const orders = await this.orderRepo.findForDashboard(startDate, endDate);

    let totalOrders = 0;
    let totalOrdersKg = 0;
    let totalOrdersPcs = 0;
    let totalValueUSD = 0;
    let totalCollectedNGN = 0;
    let totalCollectedUSD = 0;

    for (const order of orders) {
      totalOrders += 1;
      totalValueUSD += order.totalUsd ?? 0;

      for (const product of order.products) {
        for (const item of product.items) {
          if (item.unitOfCalculation === UnitOfCalculation.KG) {
            totalOrdersKg += item.quantity;
          } else if (item.unitOfCalculation === UnitOfCalculation.PCS) {
            totalOrdersPcs += item.quantity;
          }
        }
      }

      for (const history of order.history ?? []) {
        if (history.type === HistoryType.KHACH_TRA) {
          totalCollectedNGN += history.moneyPaidNGN;
          totalCollectedUSD += history.moneyPaidDolar;
        } else if (history.type === HistoryType.HOAN_TIEN) {
          totalCollectedNGN -= history.moneyPaidNGN;
          totalCollectedUSD -= history.moneyPaidDolar;
        }
      }
    }

    return {
      totalOrders,
      totalOrdersKg: roundToTwo(totalOrdersKg),
      totalOrdersPcs: roundToTwo(totalOrdersPcs),
      totalValueUSD: roundToTwo(totalValueUSD),
      totalCollectedNGN: roundToTwo(totalCollectedNGN),
      totalCollectedUSD: roundToTwo(totalCollectedUSD),
    };
  }
}
