import { CustomerEntity } from './customer.entity.js';

export interface ICustomerRepository {
  findById(id: string): Promise<CustomerEntity | null>;
  findByName(name: string): Promise<CustomerEntity | null>;
  create(customer: Partial<CustomerEntity>): Promise<CustomerEntity>;
  update(id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: CustomerEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
  updatePayment(id: string, amount: number): Promise<CustomerEntity | null>;
}
