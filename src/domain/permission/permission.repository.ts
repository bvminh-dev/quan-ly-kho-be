import { PermissionEntity } from './permission.entity.js';

export interface IPermissionRepository {
  findById(id: string): Promise<PermissionEntity | null>;
  create(permission: Partial<PermissionEntity>): Promise<PermissionEntity>;
  update(id: string, data: Partial<PermissionEntity>): Promise<PermissionEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{ items: PermissionEntity[]; meta: { current: number; pageSize: number; pages: number; total: number } }>;
  count(): Promise<number>;
  insertMany(permissions: Partial<PermissionEntity>[]): Promise<PermissionEntity[]>;
}
