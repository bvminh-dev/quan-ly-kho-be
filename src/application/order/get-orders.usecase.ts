/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
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
    currentApiPath?: string,
    currentMethod?: string,
  ) {
    // Xác định userId và tính toán canViewAllData từ user
    const userId = user?._id;
    const canViewAll = canViewAllData(
      user?.role?.name || '',
      user?.role?.isViewAllUser || false,
      user?.role?.viewAllUserApis || [],
      currentApiPath || '',
      currentMethod || '',
    );

    const result = await this.orderRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );

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
