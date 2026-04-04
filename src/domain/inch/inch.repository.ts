import { InchEntity } from './inch.entity.js';

export interface IInchRepository {
  findById(id: string): Promise<InchEntity | null>;
  findByCode(code: string): Promise<InchEntity | null>;
  create(data: Partial<InchEntity>): Promise<InchEntity>;
  update(id: string, data: Partial<InchEntity>): Promise<InchEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ): Promise<{
    items: InchEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
