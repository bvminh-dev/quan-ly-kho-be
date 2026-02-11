import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/role/role.repository.js';
import { CreateRoleDto } from './dto/create-role.dto.js';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(dto: CreateRoleDto, createdBy: string) {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new BadRequestException(`Role "${dto.name}" đã tồn tại`);
    }

    return this.roleRepository.create({
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions || [],
      isActive: dto.isActive ?? true,
      createdBy,
    });
  }
}
