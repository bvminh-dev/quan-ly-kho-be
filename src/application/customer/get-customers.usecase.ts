import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';

@Injectable()
export class GetCustomersUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.customerRepository.findAll(queryString, currentPage, pageSize);
  }
}
