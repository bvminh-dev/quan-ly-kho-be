import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { roundToTwo } from '../../common/utils/number.util.js';
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
      ...(dto.totalAmount !== undefined && {
        totalAmount: roundToTwo(dto.totalAmount),
      }),
      ...(dto.amountOccupied !== undefined && {
        amountOccupied: roundToTwo(dto.amountOccupied),
      }),
      ...(dto.amountAvailable !== undefined && {
        amountAvailable: roundToTwo(dto.amountAvailable),
      }),
      ...(dto.priceHigh !== undefined && {
        priceHigh: roundToTwo(dto.priceHigh),
      }),
      ...(dto.priceLow !== undefined && { priceLow: roundToTwo(dto.priceLow) }),
      ...(dto.sale !== undefined && { sale: roundToTwo(dto.sale) }),
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Warehouse với id ${id} không tồn tại`);
    }

    const hasPriceChange =
      (dto.priceHigh !== undefined &&
        dto.priceHigh !== oldWarehouse.priceHigh) ||
      (dto.priceLow !== undefined && dto.priceLow !== oldWarehouse.priceLow) ||
      (dto.sale !== undefined && dto.sale !== oldWarehouse.sale);

    if (hasPriceChange) {
      await this.historyWarehouseService.createHistoryEnterForUpdatePrice(
        id,
        roundToTwo(oldWarehouse.priceHigh),
        roundToTwo(dto.priceHigh ?? oldWarehouse.priceHigh),
        roundToTwo(oldWarehouse.priceLow),
        roundToTwo(dto.priceLow ?? oldWarehouse.priceLow),
        roundToTwo(oldWarehouse.sale),
        roundToTwo(dto.sale ?? oldWarehouse.sale),
        updatedBy,
      );
    }

    return updated;
  }
}
