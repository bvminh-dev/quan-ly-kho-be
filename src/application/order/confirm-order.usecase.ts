import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderState } from '../../common/enums/index.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';

@Injectable()
export class ConfirmOrderUseCase {
  private readonly logger = new Logger(ConfirmOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string, updatedBy: string) {
    this.logger.log(`Confirming order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if (order.state === OrderState.DA_CHOT) {
      throw new BadRequestException('Đơn hàng đã được chốt rồi');
    }

    if (order.state === OrderState.HOAN_TAC) {
      throw new BadRequestException('Không thể chốt đơn hàng đã hoàn tác');
    }

    const updated = await this.orderRepository.update(id, {
      state: OrderState.DA_CHOT,
      updatedBy,
    });

    return updated;
  }
}
