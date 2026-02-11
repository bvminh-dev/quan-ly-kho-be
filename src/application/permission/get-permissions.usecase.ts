import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/permission/permission.repository.js';

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.permissionRepository.findAll(queryString, currentPage, pageSize);
  }
}
