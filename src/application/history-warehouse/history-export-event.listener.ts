import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HistoryExportState } from '../../common/enums/index.js';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import { HistoryWarehouseService } from './history-warehouse.service.js';

export interface OrderCreatedEventPayload {
  orderId: string;
  createdBy: string;
}

export interface OrderPaymentAddedEventPayload {
  orderId: string;
  isRefund: boolean;
  moneyPaidNGN: number;
  note: string;
  createdBy: string;
  shouldMarkAsDone: boolean;
}

export interface OrderConfirmedEventPayload {
  orderId: string;
  updatedBy: string;
}

export interface OrderUpdatedEventPayload {
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
   * Ghi nhận lịch sử xuất kho khi đơn ở trạng thái BÁO GIÁ.
   */
  @OnEvent(HISTORY_WAREHOUSE_EVENTS.ORDER_CREATED)
  async handleOrderCreated(payload: OrderCreatedEventPayload) {
    this.logger.log(
      `Handle ORDER_CREATED for order ${payload.orderId}, creating history-export (Báo giá)`,
    );
    try {
      await this.historyWarehouseService.createHistoryExportForOrderCreated(
        payload.orderId,
        payload.createdBy,
      );
    } catch (err) {
      this.logger.error(
        `Failed to create history-export for order created: ${(err as Error)?.message}`,
      );
    }
  }

  /**
   * Ghi nhận lịch sử xuất kho khi đơn ĐÃ CHỐT.
   */
  @OnEvent(HISTORY_WAREHOUSE_EVENTS.ORDER_CONFIRMED)
  async handleOrderConfirmed(payload: OrderConfirmedEventPayload) {
    this.logger.log(
      `Handle ORDER_CONFIRMED for order ${payload.orderId}, creating history-export (Đã chốt)`,
    );
    try {
      await this.historyWarehouseService.createHistoryExportForOrderConfirmed(
        payload.orderId,
        payload.updatedBy,
      );
    } catch (err) {
      this.logger.error(
        `Failed to create history-export for order confirmed: ${(err as Error)?.message}`,
      );
    }
  }

  /**
   * Ghi nhận lịch sử xuất kho khi đơn ở trạng thái CHỈNH SỬA.
   */
  @OnEvent(HISTORY_WAREHOUSE_EVENTS.ORDER_UPDATED)
  async handleOrderUpdated(payload: OrderUpdatedEventPayload) {
    this.logger.log(
      `Handle ORDER_UPDATED for order ${payload.orderId}, creating history-export (Chỉnh sửa)`,
    );
    try {
      await this.historyWarehouseService.createHistoryExportForOrderUpdated(
        payload.orderId,
        payload.updatedBy,
      );
    } catch (err) {
      this.logger.error(
        `Failed to create history-export for order updated: ${(err as Error)?.message}`,
      );
    }
  }

  /**
   * Ghi nhận lịch sử xuất kho cho thanh toán: Khách trả / Hoàn đơn,
   * và nếu đơn đủ điều kiện ĐÃ XONG thì thêm bản ghi ĐÃ XONG.
   */
  @OnEvent(HISTORY_WAREHOUSE_EVENTS.ORDER_PAYMENT_ADDED)
  async handleOrderPaymentAdded(payload: OrderPaymentAddedEventPayload) {
    this.logger.log(
      `Handle ORDER_PAYMENT_ADDED for order ${payload.orderId} (${payload.isRefund ? 'Hoàn đơn' : 'Khách trả'})`,
    );
    try {
      const stateOrder = payload.isRefund
        ? HistoryExportState.HOAN_DON
        : HistoryExportState.KHACH_TRA;
      const paymentOrder = payload.isRefund
        ? -payload.moneyPaidNGN
        : payload.moneyPaidNGN;

      await this.historyWarehouseService.createHistoryExportForOrderPayment(
        payload.orderId,
        stateOrder,
        paymentOrder,
        payload.note,
        payload.createdBy,
      );

      if (payload.shouldMarkAsDone && !payload.isRefund) {
        this.logger.log(
          `Order ${payload.orderId} has been completed, creating history-export (Đã xong)`,
        );
        await this.historyWarehouseService.createHistoryExportForOrderCompleted(
          payload.orderId,
          payload.createdBy,
        );
      }
    } catch (err) {
      this.logger.error(
        `Failed to create history-export for payment: ${(err as Error)?.message}`,
      );
    }
  }
}
