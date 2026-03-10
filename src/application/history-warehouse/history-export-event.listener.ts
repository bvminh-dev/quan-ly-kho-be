import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import { HistoryWarehouseService } from './history-warehouse.service.js';

export interface OrderDeliveredEventPayload {
  orderId: string;
  updatedBy: string;
}

@Injectable()
export class HistoryExportEventListener {
  private readonly logger = new Logger(HistoryExportEventListener.name);

  constructor(
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  /**
   * Ghi nhận lịch sử xuất kho chỉ khi đơn hàng chuyển sang trạng thái Đã giao.
   */
  @OnEvent(HISTORY_WAREHOUSE_EVENTS.ORDER_DELIVERED)
  async handleOrderDelivered(payload: OrderDeliveredEventPayload) {
    this.logger.log(
      `Handle ORDER_DELIVERED for order ${payload.orderId}, creating history-export (Đã giao)`,
    );
    try {
      await this.historyWarehouseService.createHistoryExportForOrderDelivered(
        payload.orderId,
        payload.updatedBy,
      );
    } catch (err) {
      this.logger.error(
        `Failed to create history-export for order delivered: ${(err as Error)?.message}`,
      );
    }
  }
}
