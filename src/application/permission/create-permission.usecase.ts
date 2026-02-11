import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/permission/permission.repository.js';
import { CreatePermissionDto } from './dto/create-permission.dto.js';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(dto: CreatePermissionDto, createdBy: string) {
    return this.permissionRepository.create({
      name: dto.name,
      apiPath: dto.apiPath,
      method: dto.method,
      module: dto.module,
      description: dto.description,
      isActive: dto.isActive ?? true,
      createdBy,
    });
  }
}
