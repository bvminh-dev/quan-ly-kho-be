import {
  BadRequestException,
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
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';

@Injectable()
export class CreateWarehouseUseCase {
  private readonly logger = new Logger(CreateWarehouseUseCase.name);

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

  async execute(dto: CreateWarehouseDto, createdBy: string) {
    this.logger.log(`Creating warehouse item with inchId=${dto.inchId}`);

    const [inch, item, quality, style, color] = await Promise.all([
      this.inchRepository.findById(dto.inchId),
      this.itemRepository.findById(dto.itemId),
      this.qualityRepository.findById(dto.qualityId),
      this.styleRepository.findById(dto.styleId),
      this.colorRepository.findById(dto.colorId),
    ]);

    if (!inch) throw new NotFoundException(`Inch với id ${dto.inchId} không tồn tại`);
    if (!item) throw new NotFoundException(`Item với id ${dto.itemId} không tồn tại`);
    if (!quality) throw new NotFoundException(`Quality với id ${dto.qualityId} không tồn tại`);
    if (!style) throw new NotFoundException(`Style với id ${dto.styleId} không tồn tại`);
    if (!color) throw new NotFoundException(`Color với id ${dto.colorId} không tồn tại`);

    const existingWarehouse = await this.warehouseRepository.findByAttributes(
      dto.inchId,
      dto.itemId,
      dto.qualityId,
      dto.styleId,
      dto.colorId,
    );

    if (existingWarehouse) {
      this.logger.warn(`Warehouse item already exists`);
      throw new BadRequestException('Hàng đã tồn tại trong hệ thống');
    }

    const inchValue = parseFloat(inch.name);

    const warehouse = await this.warehouseRepository.create({
      inchId: dto.inchId,
      itemId: dto.itemId,
      qualityId: dto.qualityId,
      styleId: dto.styleId,
      colorId: dto.colorId,
      inches: isNaN(inchValue) ? 0 : inchValue,
      item: item.name,
      quality: quality.name,
      style: style.name,
      color: color.name,
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
