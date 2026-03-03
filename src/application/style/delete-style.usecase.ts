import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IStyleRepository } from '../../domain/style/style.repository.js';
import {
  Warehouse,
  WarehouseDocument,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';

@Injectable()
export class DeleteStyleUseCase {
  private readonly logger = new Logger(DeleteStyleUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting style ${id}`);

    const existing = await this.styleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Style với id ${id} không tồn tại`);
    }

    const usageCount = await this.warehouseModel.countDocuments({
      styleId: id as any,
      isDeleted: false,
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa style này vì đang được sử dụng trong ${usageCount} bản ghi kho`,
      );
    }

    await this.styleRepository.softDelete(id, deleteBy);
  }
}
