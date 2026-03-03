import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';
import type { IItemRepository } from '../../domain/item/item.repository.js';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';
import type { IStyleRepository } from '../../domain/style/style.repository.js';
import type { IColorRepository } from '../../domain/color/color.repository.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto.js';

@Injectable()
export class UpdateWarehouseUseCase {
  private readonly logger = new Logger(UpdateWarehouseUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  async execute(id: string, dto: UpdateWarehouseDto, updatedBy: string) {
    this.logger.log(`Updating warehouse ${id}`);

    const oldWarehouse = await this.warehouseRepository.findById(id);
    if (!oldWarehouse) {
      throw new NotFoundException(`Warehouse với id ${id} không tồn tại`);
    }

    const updateData: Record<string, any> = { updatedBy };

    if (dto.inchId !== undefined) {
      const inch = await this.inchRepository.findById(dto.inchId);
      if (!inch) throw new NotFoundException(`Inch với id ${dto.inchId} không tồn tại`);
      updateData.inchId = dto.inchId;
      const inchValue = parseFloat(inch.name);
      updateData.inches = isNaN(inchValue) ? 0 : inchValue;
    }

    if (dto.itemId !== undefined) {
      const item = await this.itemRepository.findById(dto.itemId);
      if (!item) throw new NotFoundException(`Item với id ${dto.itemId} không tồn tại`);
      updateData.itemId = dto.itemId;
      updateData.item = item.name;
    }

    if (dto.qualityId !== undefined) {
      const quality = await this.qualityRepository.findById(dto.qualityId);
      if (!quality) throw new NotFoundException(`Quality với id ${dto.qualityId} không tồn tại`);
      updateData.qualityId = dto.qualityId;
      updateData.quality = quality.name;
    }

    if (dto.styleId !== undefined) {
      const style = await this.styleRepository.findById(dto.styleId);
      if (!style) throw new NotFoundException(`Style với id ${dto.styleId} không tồn tại`);
      updateData.styleId = dto.styleId;
      updateData.style = style.name;
    }

    if (dto.colorId !== undefined) {
      const color = await this.colorRepository.findById(dto.colorId);
      if (!color) throw new NotFoundException(`Color với id ${dto.colorId} không tồn tại`);
      updateData.colorId = dto.colorId;
      updateData.color = color.name;
    }

    if (dto.totalAmount !== undefined) updateData.totalAmount = roundToTwo(dto.totalAmount);
    if (dto.amountOccupied !== undefined) updateData.amountOccupied = roundToTwo(dto.amountOccupied);
    if (dto.amountAvailable !== undefined) updateData.amountAvailable = roundToTwo(dto.amountAvailable);
    if (dto.priceHigh !== undefined) updateData.priceHigh = roundToTwo(dto.priceHigh);
    if (dto.priceLow !== undefined) updateData.priceLow = roundToTwo(dto.priceLow);
    if (dto.sale !== undefined) updateData.sale = roundToTwo(dto.sale);
    if (dto.unitOfCalculation !== undefined) updateData.unitOfCalculation = dto.unitOfCalculation;

    const updated = await this.warehouseRepository.update(id, updateData);

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
