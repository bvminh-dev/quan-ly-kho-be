import { ItemEntity } from './item.entity.js';

export interface IItemRepository {
  findById(id: string): Promise<ItemEntity | null>;
  findByCode(code: string): Promise<ItemEntity | null>;
  create(data: Partial<ItemEntity>): Promise<ItemEntity>;
  update(id: string, data: Partial<ItemEntity>): Promise<ItemEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ): Promise<{
    items: ItemEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
