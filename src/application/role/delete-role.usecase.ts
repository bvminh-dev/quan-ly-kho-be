import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/role/role.repository.js';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(id: string, deleteBy: string) {
    // Check if it's the admin role
    const role = await this.roleRepository.findById(id);
    if (role && role.name === 'admin') {
      throw new BadRequestException('Không thể xóa role admin');
    }

    return this.roleRepository.softDelete(id, deleteBy);
  }
}
