import { Inject, Injectable } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class GetWarehousesUseCase {
  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.warehouseRepository.findAll(queryString, currentPage, pageSize);
  }
}
