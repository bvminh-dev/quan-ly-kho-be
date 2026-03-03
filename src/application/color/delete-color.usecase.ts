import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IColorRepository } from '../../domain/color/color.repository.js';
import {
  Warehouse,
  WarehouseDocument,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';

@Injectable()
export class DeleteColorUseCase {
  private readonly logger = new Logger(DeleteColorUseCase.name);

  constructor(
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting color ${id}`);

    const existing = await this.colorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Color với id ${id} không tồn tại`);
    }

    const usageCount = await this.warehouseModel.countDocuments({
      colorId: id as any,
      isDeleted: false,
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa color này vì đang được sử dụng trong ${usageCount} bản ghi kho`,
      );
    }

    await this.colorRepository.softDelete(id, deleteBy);
  }
}
