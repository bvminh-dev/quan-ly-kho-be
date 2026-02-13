import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { AddStockDto } from './dto/add-stock.dto.js';

@Injectable()
export class AddStockUseCase {
  private readonly logger = new Logger(AddStockUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(dto: AddStockDto, updatedBy: string) {
    this.logger.log(
      `Adding stock to warehouse ${dto.warehouseId}: ${dto.quantity}`,
    );

    const warehouse = await this.warehouseRepository.findById(dto.warehouseId);

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse với id ${dto.warehouseId} không tồn tại`,
      );
    }

    const updated = await this.warehouseRepository.update(dto.warehouseId, {
      totalAmount: warehouse.totalAmount + dto.quantity,
      amountAvailable: warehouse.amountAvailable + dto.quantity,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(
        `Warehouse với id ${dto.warehouseId} không tồn tại`,
      );
    }

    this.logger.log(
      `Successfully added ${dto.quantity} to warehouse ${dto.warehouseId}`,
    );

    return updated;
  }
}
