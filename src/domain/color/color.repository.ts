import { ColorEntity } from './color.entity.js';

export interface IColorRepository {
  findById(id: string): Promise<ColorEntity | null>;
  findByCode(code: string): Promise<ColorEntity | null>;
  create(data: Partial<ColorEntity>): Promise<ColorEntity>;
  update(id: string, data: Partial<ColorEntity>): Promise<ColorEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: ColorEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
