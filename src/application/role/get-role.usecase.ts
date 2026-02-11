import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/role/role.repository.js';

@Injectable()
export class GetRoleUseCase {
    constructor(
        @Inject('RoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(id: string) {
        const role = await this.roleRepository.findByIdWithPopulate(id);
        if (!role) {
            throw new NotFoundException(`Role với id ${id} không tồn tại`);
        }
        return role;
    }
}
