import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  ) {}

  async execute(orderId: string, dto: AddHistoryDto, createdBy: string) {
    this.logger.log(`Adding history to order ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order với id ${orderId} không tồn tại`);
    }

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    const isRefund =
      dto.type?.toLowerCase() === HistoryType.HOAN_TIEN.toLowerCase();

    const newPayment = roundToTwo(
      isRefund
        ? order.payment - dto.moneyPaidNGN
        : order.payment + dto.moneyPaidNGN,
    );

    const newDebt = roundToTwo(newPayment < 0 ? -newPayment : 0);

    const shouldMarkAsDone =
      (order.state as OrderState) !== OrderState.DA_XONG &&
      (order.state as OrderState) !== OrderState.HOAN_TAC &&
      newPayment >= 0;

    if (shouldMarkAsDone) {
      for (const product of order.products) {
        for (const item of product.items) {
          const quantitySet = product.quantitySet ?? 1;
          const totalQuantity = roundToTwo(quantitySet * item.quantity);

          await this.warehouseRepository.decreaseTotalAndOccupied(
            item.id,
            totalQuantity,
          );
        }
      }

      await this.orderRepository.update(orderId, {
        payment: newPayment,
        debt: newDebt,
        state: OrderState.DA_XONG as string,
      });
    } else {
      await this.orderRepository.update(orderId, {
        payment: newPayment,
        debt: newDebt,
      });
    }

    this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_PAYMENT_ADDED, {
      orderId,
      isRefund,
      moneyPaidNGN: dto.moneyPaidNGN,
      note: dto.note ?? '',
      createdBy,
      shouldMarkAsDone,
    });

    const updatedOrder = await this.orderRepository.addHistory(orderId, {
      type: dto.type,
      exchangeRate: roundToTwo(dto.exchangeRate),
      moneyPaidNGN: roundToTwo(dto.moneyPaidNGN),
      moneyPaidDolar: roundToTwo(dto.moneyPaidDolar),
      paymentMethod: dto.paymentMethod,
      datePaid: dto.datePaid,
      note: dto.note ?? '',
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
