import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IOrderRepository } from '../../domain/order/order.repository.js';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }
    return order;
  }
}
