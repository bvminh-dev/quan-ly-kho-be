import { OrderEntity } from './order.entity.js';

export interface IOrderRepository {
  findById(id: string): Promise<OrderEntity | null>;
  create(order: Partial<OrderEntity>): Promise<OrderEntity>;
  update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: OrderEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
  addHistory(id: string, history: any): Promise<OrderEntity | null>;
}
