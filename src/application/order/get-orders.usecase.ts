import { Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../../domain/order/order.repository.js';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.orderRepository.findAll(queryString, currentPage, pageSize);
  }
}
