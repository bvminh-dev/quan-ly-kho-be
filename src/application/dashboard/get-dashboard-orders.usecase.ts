import { Inject, Injectable, Logger } from '@nestjs/common';
import { HistoryType } from '../../common/enums/index.js';
import { getDateRange } from '../../common/utils/date.util.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { countItemQuantities } from '../../common/utils/order.util.js';
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
    let totalCollectedUSD = 0;
    let totalDebtUSD = 0;
    let totalValueNGN = 0;
    let totalCollectedNGN = 0;

    for (const order of orders) {
      totalOrders += 1;

      const orderTotalUsd = (order.totalUsd ?? 0) + (order.debt ?? 0);
      const orderPaidedUsd = order.paidedUsd ?? 0;
      const orderExchangeRate = order.exchangeRate ?? 0;

      totalValueUSD += orderTotalUsd;
      totalCollectedUSD += orderPaidedUsd;
      totalDebtUSD += orderTotalUsd - orderPaidedUsd;
      totalValueNGN += orderTotalUsd * orderExchangeRate;

      const { kg, pcs } = countItemQuantities(order.products);
      totalOrdersKg += kg;
      totalOrdersPcs += pcs;

      for (const history of order.history ?? []) {
        if (history.type === HistoryType.KHACH_TRA) {
          totalCollectedNGN += history.moneyPaidNGN;
        } else if (history.type === HistoryType.HOAN_TIEN) {
          totalCollectedNGN -= history.moneyPaidNGN;
        }
      }
    }

    return {
      totalOrders,
      totalOrdersKg: roundToTwo(totalOrdersKg),
      totalOrdersPcs: roundToTwo(totalOrdersPcs),
      totalValueUSD: roundToTwo(totalValueUSD),
      totalCollectedUSD: roundToTwo(totalCollectedUSD),
      totalDebtUSD: roundToTwo(totalDebtUSD),
      totalValueNGN: roundToTwo(totalValueNGN),
      totalCollectedNGN: roundToTwo(totalCollectedNGN),
    };
  }
}
