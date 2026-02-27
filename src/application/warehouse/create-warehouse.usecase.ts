import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';

@Injectable()
export class CreateWarehouseUseCase {
  private readonly logger = new Logger(CreateWarehouseUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  async execute(dto: CreateWarehouseDto, createdBy: string) {
    this.logger.log(`Creating warehouse item: ${dto.item} ${dto.inches}"`);

    const existingWarehouse = await this.warehouseRepository.findByAttributes(
      dto.inches,
      dto.item,
      dto.quality,
      dto.style,
      dto.color,
    );

    if (existingWarehouse) {
      this.logger.warn(
        `Warehouse item already exists: ${dto.item} ${dto.inches}" ${dto.quality} ${dto.style} ${dto.color}`,
      );
      throw new BadRequestException('Hàng đã tồn tại trong hệ thống');
    }

    const warehouse = await this.warehouseRepository.create({
      inches: dto.inches,
      item: dto.item,
      quality: dto.quality,
      style: dto.style,
      color: dto.color,
      totalAmount: roundToTwo(dto.totalAmount),
      amountOccupied: 0,
      amountAvailable: roundToTwo(dto.totalAmount),
      unitOfCalculation: dto.unitOfCalculation,
      priceHigh: roundToTwo(dto.priceHigh ?? 0),
      priceLow: roundToTwo(dto.priceLow ?? 0),
      sale: roundToTwo(dto.sale ?? 0),
      createdBy,
    });

    await this.historyWarehouseService.createHistoryEnterForCreateWarehouse(
      warehouse._id,
      createdBy,
    );

    return warehouse;
  }
}
