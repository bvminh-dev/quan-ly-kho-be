import { HistoryExportEntity } from './history-export.entity.js';

export interface IHistoryExportRepository {
  findById(id: string): Promise<HistoryExportEntity | null>;
  create(history: Partial<HistoryExportEntity>): Promise<HistoryExportEntity>;
  update(
    id: string,
    data: Partial<HistoryExportEntity>,
  ): Promise<HistoryExportEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ): Promise<{
    items: HistoryExportEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
