import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';

@Injectable()
export class DeleteCustomerUseCase {
  private readonly logger = new Logger(DeleteCustomerUseCase.name);

  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting customer ${id}`);

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer với id ${id} không tồn tại`);
    }

    await this.customerRepository.softDelete(id, deleteBy);
  }
}
