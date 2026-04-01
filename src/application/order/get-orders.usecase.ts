/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { ICurrentUser } from '../../common/interfaces/current-user.interface.js';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) { }

  async execute(
    queryString: string,
    currentPage: number,
    pageSize: number,
    user?: ICurrentUser,
  ) {
    // Nếu có user và không phải admin thì chỉ lấy đơn hàng của user đó
    let result;
    if (user && user.role?.name !== 'admin') {
      const existingQuery = queryString ? `${queryString}&` : '';
      const finalQueryString = `${existingQuery}createdBy=${user._id}`;
      result = await this.orderRepository.findAll(
        finalQueryString,
        currentPage,
        pageSize,
      );
    } else {
      result = await this.orderRepository.findAll(
        queryString,
        currentPage,
        pageSize,
      );
    }

    // Lấy unique customer IDs từ danh sách orders
    const customerIds = [
      ...new Set(
        result.items.map((order) =>
          typeof order.customer === 'object' && order.customer !== null
            ? order.customer._id
            : String(order.customer),
        ),
      ),
    ] as string[];

    if (customerIds.length > 0) {
      const latestMap =
        await this.orderRepository.findLatestOrderIdsPerCustomer(customerIds);

      for (const order of result.items) {
        const cId =
          typeof order.customer === 'object' && order.customer !== null
            ? order.customer._id
            : String(order.customer);
        const latestId = latestMap.get(cId);
        order.latestOrder = latestId ? latestId === order._id : false;
      }
    } else {
      for (const order of result.items) {
        order.latestOrder = false;
      }
    }

    return result;
  }
}
