import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';

@Injectable()
export class CreateWarehouseUseCase {
  private readonly logger = new Logger(CreateWarehouseUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(dto: CreateWarehouseDto, createdBy: string) {
    this.logger.log(`Creating warehouse item: ${dto.item} ${dto.inches}"`);

    const warehouse = await this.warehouseRepository.create({
      inches: dto.inches,
      item: dto.item,
      quality: dto.quality,
      style: dto.style,
      color: dto.color,
      totalAmount: dto.totalAmount,
      amountOccupied: 0,
      amountAvailable: dto.totalAmount,
      unitOfCalculation: dto.unitOfCalculation,
      priceHigh: dto.priceHigh ?? 0,
      priceLow: dto.priceLow ?? 0,
      sale: dto.sale ?? 0,
      createdBy,
    });

    return warehouse;
  }
}
