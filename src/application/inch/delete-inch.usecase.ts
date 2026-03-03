import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';
import {
  Warehouse,
  WarehouseDocument,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';

@Injectable()
export class DeleteInchUseCase {
  private readonly logger = new Logger(DeleteInchUseCase.name);

  constructor(
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting inch ${id}`);

    const existing = await this.inchRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Inch với id ${id} không tồn tại`);
    }

    const usageCount = await this.warehouseModel.countDocuments({
      inchId: id as any,
      isDeleted: false,
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa inch này vì đang được sử dụng trong ${usageCount} bản ghi kho`,
      );
    }

    await this.inchRepository.softDelete(id, deleteBy);
  }
}
