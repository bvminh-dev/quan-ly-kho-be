import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/permission/permission.repository.js';

@Injectable()
export class GetPermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission với id ${id} không tồn tại`);
    }
    return permission;
  }
}
