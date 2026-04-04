import { Inject, Injectable } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class GetWarehousesUseCase {
  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    roleName?: string,
    isViewAllUser?: boolean,
    viewAllUserApis?: Array<{ _id: string; apiPath: string; method: string }>,
    currentApiPath?: string,
    currentMethod?: string,
  ) {
    const canViewAll = canViewAllData(
      roleName || '',
      isViewAllUser || false,
      viewAllUserApis || [],
      currentApiPath || '',
      currentMethod || '',
    );

    return this.warehouseRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );
  }
}
