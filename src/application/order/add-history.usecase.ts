import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryType, OrderState } from '../../common/enums/index.js';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { AddHistoryDto } from './dto/add-history.dto.js';

@Injectable()
export class AddHistoryUseCase {
  private readonly logger = new Logger(AddHistoryUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(orderId: string, dto: AddHistoryDto, createdBy: string) {
    this.logger.log(`Adding history to order ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order với id ${orderId} không tồn tại`);
    }

    const currentState = order.state as OrderState;

    // Chỉ ghi nhận thanh toán khi đơn hàng đang ở trạng thái "Đã chốt"
    if (
      currentState !== OrderState.DA_CHOT &&
      currentState !== OrderState.DA_GIAO
    ) {
      throw new BadRequestException(
        `Chỉ có thể ghi nhận thanh toán khi đơn hàng đang ở trạng thái "Đã chốt" hoặc "Đã giao". Trạng thái hiện tại: "${currentState}"`,
      );
    }

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    const isRefund =
      dto.type?.toLowerCase() === HistoryType.HOAN_TIEN.toLowerCase();

    const newPaidedUsd = roundToTwo(
      isRefund
        ? order.paidedUsd - dto.moneyPaidDolar
        : order.paidedUsd + dto.moneyPaidDolar,
    );

    // Khi nhận được một phần tiền thanh toán (không phải hoàn tiền), hàng trong kho được tính là đã chiếm dụng và không phải tiền hệ thống tự thanh toán: paymwntType=auto
    // Cập nhật amountOccupied và giảm amountAvailable
    if (!isRefund && dto.moneyPaidNGN > 0 && dto.paymentType !== 'auto') {
      // Kiểm tra xem đã chiếm dụng chưa (dựa vào history trước đó)
      const hasPreviousPayment = order.history.some(
        (h) =>
          h.type === HistoryType.KHACH_TRA.toString() &&
          h.paymentType !== 'auto',
      );

      // Chỉ chiếm dụng lần đầu tiên khi nhận tiền
      if (!hasPreviousPayment) {
        // Kiểm tra số lượng hàng trong kho trước khi chiếm dụng
        for (const product of order.products) {
          for (const item of product.items) {
            const warehouse = await this.warehouseRepository.findById(item.id);
            if (!warehouse) {
              throw new NotFoundException(
                `Warehouse với id ${item.id} không tồn tại`,
              );
            }

            const quantitySet = product.quantitySet ?? 1;
            const requiredQuantity = roundToTwo(quantitySet * item.quantity);

            if (warehouse.amountAvailable < requiredQuantity) {
              throw new BadRequestException(
                'Hàng trong kho không đủ để thanh toán',
              );
            }
          }
        }

        // Sau khi kiểm tra đủ hàng, mới chiếm dụng
        for (const product of order.products) {
          for (const item of product.items) {
            const quantitySet = product.quantitySet ?? 1;
            const occupiedQuantity = roundToTwo(quantitySet * item.quantity);

            await this.warehouseRepository.updateStock(
              item.id,
              occupiedQuantity,
              -occupiedQuantity,
            );
          }
        }
      }
    }

    await this.orderRepository.update(orderId, {
      paidedUsd: newPaidedUsd,
    });

    this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_PAYMENT_ADDED, {
      orderId,
      isRefund,
      moneyPaidNGN: dto.moneyPaidNGN,
      note: dto.note ?? '',
      createdBy,
    });

    const updatedOrder = await this.orderRepository.addHistory(orderId, {
      type: dto.type,
      exchangeRate: roundToTwo(dto.exchangeRate),
      moneyPaidNGN: roundToTwo(dto.moneyPaidNGN),
      moneyPaidDolar: roundToTwo(dto.moneyPaidDolar),
      paymentMethod: dto.paymentMethod,
      datePaid: dto.datePaid,
      note: dto.note ?? '',
      paymentType: dto.paymentType ?? 'manual',
    });

    if (
      updatedOrder &&
      (updatedOrder.state as OrderState) !== OrderState.BAO_GIA
    ) {
      const customerPayment =
        await this.orderRepository.calculateCustomerPayment(customerId);

      await this.customerRepository.update(customerId, {
        payment: customerPayment,
      });
    }

    return updatedOrder;
  }
}
