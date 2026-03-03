import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IItemRepository } from '../../domain/item/item.repository.js';
import {
  Warehouse,
  WarehouseDocument,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';

@Injectable()
export class DeleteItemUseCase {
  private readonly logger = new Logger(DeleteItemUseCase.name);

  constructor(
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting item ${id}`);

    const existing = await this.itemRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Item với id ${id} không tồn tại`);
    }

    const usageCount = await this.warehouseModel.countDocuments({
      itemId: id as any,
      isDeleted: false,
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa item này vì đang được sử dụng trong ${usageCount} bản ghi kho`,
      );
    }

    await this.itemRepository.softDelete(id, deleteBy);
  }
}
