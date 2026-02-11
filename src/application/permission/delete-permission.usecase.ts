import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/permission/permission.repository.js';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    await this.permissionRepository.softDelete(id, deleteBy);
  }
}
