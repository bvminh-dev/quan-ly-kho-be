import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';
import {
  Warehouse,
  WarehouseDocument,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';

@Injectable()
export class DeleteQualityUseCase {
  private readonly logger = new Logger(DeleteQualityUseCase.name);

  constructor(
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting quality ${id}`);

    const existing = await this.qualityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quality với id ${id} không tồn tại`);
    }

    const usageCount = await this.warehouseModel.countDocuments({
      qualityId: id as any,
      isDeleted: false,
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa quality này vì đang được sử dụng trong ${usageCount} bản ghi kho`,
      );
    }

    await this.qualityRepository.softDelete(id, deleteBy);
  }
}
