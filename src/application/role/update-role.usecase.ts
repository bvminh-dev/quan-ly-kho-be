import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/role/role.repository.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(id: string, dto: UpdateRoleDto, updatedBy: string) {
    // Get current role to check if name is being changed to admin
    const currentRole = await this.roleRepository.findById(id);
    if (!currentRole) {
      throw new NotFoundException(`Role với id ${id} không tồn tại`);
    }

    // Admin role luôn có isViewAllUser = true
    const newRoleName = dto.name ?? currentRole.name;
    let isViewAllUser = dto.isViewAllUser;

    if (newRoleName.toLowerCase() === 'admin') {
      isViewAllUser = true;
    }

    const updated = await this.roleRepository.update(id, {
      ...dto,
      isViewAllUser,
      viewAllUserApis: dto.viewAllUserApis ?? currentRole.viewAllUserApis,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Role với id ${id} không tồn tại`);
    }

    return updated;
  }
}
