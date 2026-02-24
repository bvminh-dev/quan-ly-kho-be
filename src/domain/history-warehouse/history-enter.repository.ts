import { HistoryEnterEntity } from './history-enter.entity.js';

export interface IHistoryEnterRepository {
  findById(id: string): Promise<HistoryEnterEntity | null>;
  create(history: Partial<HistoryEnterEntity>): Promise<HistoryEnterEntity>;
  update(
    id: string,
    data: Partial<HistoryEnterEntity>,
  ): Promise<HistoryEnterEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: HistoryEnterEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
}
