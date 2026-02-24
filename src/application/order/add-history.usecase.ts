import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HistoryExportState, HistoryType, OrderState } from '../../common/enums/index.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';
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
    private readonly historyWarehouseService: HistoryWarehouseService,
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

    const newPayment = isRefund
      ? order.payment - dto.moneyPaidNGN
      : order.payment + dto.moneyPaidNGN;

    if (isRefund) {
      await this.customerRepository.updatePayment(
        customerId,
        -dto.moneyPaidNGN,
      );
    } else {
      await this.customerRepository.updatePayment(customerId, dto.moneyPaidNGN);
    }

    const shouldMarkAsDone =
      (order.state as OrderState) !== OrderState.DA_XONG &&
      (order.state as OrderState) !== OrderState.HOAN_TAC &&
      newPayment >= 0;

    if (shouldMarkAsDone) {
      for (const product of order.products) {
        for (const item of product.items) {
          await this.warehouseRepository.decreaseTotalAndOccupied(
            item.id,
            item.quantity,
          );

          await this.historyWarehouseService.createHistoryExportForOrder(
            item.id,
            orderId,
            item.quantity,
            HistoryExportState.KHACH_TRA,
            dto.moneyPaidNGN,
            dto.note ?? '',
            createdBy,
          );
        }
      }

      await this.orderRepository.update(orderId, {
        payment: newPayment,
        state: OrderState.DA_XONG as string,
      });
    } else {
      await this.orderRepository.update(orderId, { payment: newPayment });
    }

    const updatedOrder = await this.orderRepository.addHistory(orderId, {
      type: dto.type,
      exchangeRate: dto.exchangeRate,
      moneyPaidNGN: dto.moneyPaidNGN,
      moneyPaidDolar: dto.moneyPaidDolar,
      paymentMethod: dto.paymentMethod,
      datePaid: dto.datePaid,
      note: dto.note ?? '',
    });

    return updatedOrder;
  }
}
