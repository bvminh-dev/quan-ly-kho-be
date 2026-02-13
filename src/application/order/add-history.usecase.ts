import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HistoryType } from '../../common/enums/index.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import { AddHistoryDto } from './dto/add-history.dto.js';

@Injectable()
export class AddHistoryUseCase {
  private readonly logger = new Logger(AddHistoryUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(orderId: string, dto: AddHistoryDto) {
    this.logger.log(`Adding history to order ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order với id ${orderId} không tồn tại`);
    }

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    if (dto.type?.toLowerCase() === HistoryType.HOAN_TIEN.toLowerCase()) {
      const newPayment = order.payment - dto.moneyPaidNGN;
      await this.orderRepository.update(orderId, { payment: newPayment });
      await this.customerRepository.updatePayment(
        customerId,
        -dto.moneyPaidNGN,
      );
    } else {
      const newPayment = order.payment + dto.moneyPaidNGN;
      await this.orderRepository.update(orderId, { payment: newPayment });
      await this.customerRepository.updatePayment(customerId, dto.moneyPaidNGN);
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
