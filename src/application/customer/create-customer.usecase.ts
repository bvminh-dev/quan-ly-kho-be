import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';

@Injectable()
export class CreateCustomerUseCase {
  private readonly logger = new Logger(CreateCustomerUseCase.name);

  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(dto: CreateCustomerDto, createdBy: string) {
    this.logger.log(`Creating customer with name ${dto.name}`);

    const existing = await this.customerRepository.findByName(dto.name);
    if (existing) {
      throw new BadRequestException(`Customer "${dto.name}" đã tồn tại trong hệ thống`);
    }

    const customer = await this.customerRepository.create({
      name: dto.name,
      payment: dto.payment ?? 0,
      note: dto.note ?? '',
      createdBy,
    });

    return {
      _id: customer._id,
      name: customer.name,
      payment: customer.payment,
      note: customer.note,
      createdAt: customer.createdAt,
    };
  }
}
