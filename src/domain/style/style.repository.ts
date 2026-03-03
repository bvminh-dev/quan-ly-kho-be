import { StyleEntity } from './style.entity.js';

export interface IStyleRepository {
  findById(id: string): Promise<StyleEntity | null>;
  findByCode(code: string): Promise<StyleEntity | null>;
  create(data: Partial<StyleEntity>): Promise<StyleEntity>;
  update(id: string, data: Partial<StyleEntity>): Promise<StyleEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: StyleEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
