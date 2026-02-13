import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class DeleteWarehouseUseCase {
  private readonly logger = new Logger(DeleteWarehouseUseCase.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting warehouse ${id}`);

    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse với id ${id} không tồn tại`);
    }

    await this.warehouseRepository.softDelete(id, deleteBy);
  }
}
