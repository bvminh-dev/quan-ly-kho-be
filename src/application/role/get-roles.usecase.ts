import { Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/role/role.repository.js';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.roleRepository.findAll(queryString, currentPage, pageSize);
  }
}
