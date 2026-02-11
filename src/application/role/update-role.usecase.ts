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
    const updated = await this.roleRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Role với id ${id} không tồn tại`);
    }

    return updated;
  }
}
