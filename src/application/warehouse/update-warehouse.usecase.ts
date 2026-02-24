import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto.js';

@Injectable()
export class UpdateWarehouseUseCase {
  private readonly logger = new Logger(UpdateWarehouseUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  async execute(id: string, dto: UpdateWarehouseDto, updatedBy: string) {
    this.logger.log(`Updating warehouse ${id}`);

    const oldWarehouse = await this.warehouseRepository.findById(id);
    if (!oldWarehouse) {
      throw new NotFoundException(`Warehouse với id ${id} không tồn tại`);
    }

    const updated = await this.warehouseRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Warehouse với id ${id} không tồn tại`);
    }

    const hasPriceChange =
      (dto.priceHigh !== undefined && dto.priceHigh !== oldWarehouse.priceHigh) ||
      (dto.priceLow !== undefined && dto.priceLow !== oldWarehouse.priceLow) ||
      (dto.sale !== undefined && dto.sale !== oldWarehouse.sale);

    if (hasPriceChange) {
      await this.historyWarehouseService.createHistoryEnterForUpdatePrice(
        id,
        oldWarehouse.priceHigh,
        dto.priceHigh ?? oldWarehouse.priceHigh,
        oldWarehouse.priceLow,
        dto.priceLow ?? oldWarehouse.priceLow,
        oldWarehouse.sale,
        dto.sale ?? oldWarehouse.sale,
        updatedBy,
      );
    }

    return updated;
  }
}
