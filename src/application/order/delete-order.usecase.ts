import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IOrderRepository } from '../../domain/order/order.repository.js';

@Injectable()
export class DeleteOrderUseCase {
  private readonly logger = new Logger(DeleteOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    await this.orderRepository.softDelete(id, deleteBy);
  }
}
