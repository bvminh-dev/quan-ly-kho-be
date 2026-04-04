import { QualityEntity } from './quality.entity.js';

export interface IQualityRepository {
  findById(id: string): Promise<QualityEntity | null>;
  findByCode(code: string): Promise<QualityEntity | null>;
  create(data: Partial<QualityEntity>): Promise<QualityEntity>;
  update(
    id: string,
    data: Partial<QualityEntity>,
  ): Promise<QualityEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ): Promise<{
    items: QualityEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
