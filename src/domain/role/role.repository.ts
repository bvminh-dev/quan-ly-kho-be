import { RoleEntity } from './role.entity.js';

export interface IRoleRepository {
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  create(role: Partial<RoleEntity>): Promise<RoleEntity>;
  update(id: string, data: Partial<RoleEntity>): Promise<RoleEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{ items: RoleEntity[]; meta: { current: number; pageSize: number; pages: number; total: number } }>;
  count(): Promise<number>;
  findByIdWithPopulate(id: string): Promise<RoleEntity | null>;
}
