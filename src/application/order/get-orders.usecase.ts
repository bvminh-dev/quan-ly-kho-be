import { Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { ICurrentUser } from '../../common/interfaces/current-user.interface.js';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    queryString: string,
    currentPage: number,
    pageSize: number,
    user?: ICurrentUser,
  ) {
    // Nếu có user và không phải admin thì chỉ lấy đơn hàng của user đó
    if (user && user.role?.name !== 'admin') {
      const existingQuery = queryString ? `${queryString}&` : '';
      const finalQueryString = `${existingQuery}createdBy=${user._id}`;
      return this.orderRepository.findAll(
        finalQueryString,
        currentPage,
        pageSize,
      );
    }

    return this.orderRepository.findAll(queryString, currentPage, pageSize);
  }
}
