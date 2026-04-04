import { Inject, Injectable } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
import type { IRoleRepository } from '../../domain/role/role.repository.js';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
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
    // Tính toán canViewAllData dựa trên role và API hiện tại
    const canViewAll = canViewAllData(
      roleName || '',
      isViewAllUser || false,
      viewAllUserApis || [],
      currentApiPath || '',
      currentMethod || '',
    );

    return this.roleRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );
  }
}
