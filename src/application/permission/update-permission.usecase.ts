import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/permission/permission.repository.js';
import { UpdatePermissionDto } from './dto/update-permission.dto.js';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(id: string, dto: UpdatePermissionDto, updatedBy: string) {
    const updated = await this.permissionRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Permission với id ${id} không tồn tại`);
    }

    return updated;
  }
}
