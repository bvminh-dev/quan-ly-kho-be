import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer với id ${id} không tồn tại`);
    }

    return {
      _id: customer._id,
      name: customer.name,
      payment: customer.payment,
      note: customer.note,
      createdBy: customer.createdBy,
      updatedBy: customer.updatedBy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
