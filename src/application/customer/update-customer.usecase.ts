import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class UpdateCustomerUseCase {
  private readonly logger = new Logger(UpdateCustomerUseCase.name);

  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string, dto: UpdateCustomerDto, updatedBy: string) {
    this.logger.log(`Updating customer ${id}`);

    if (dto.name) {
      const existing = await this.customerRepository.findByName(dto.name);
      if (existing && existing._id !== id) {
        throw new BadRequestException(`Customer "${dto.name}" đã tồn tại trong hệ thống`);
      }
    }

    const updated = await this.customerRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Customer với id ${id} không tồn tại`);
    }

    return updated;
  }
}
