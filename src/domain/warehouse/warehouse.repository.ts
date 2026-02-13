import { WarehouseEntity } from './warehouse.entity.js';

export interface IWarehouseRepository {
  findById(id: string): Promise<WarehouseEntity | null>;
  create(warehouse: Partial<WarehouseEntity>): Promise<WarehouseEntity>;
  update(id: string, data: Partial<WarehouseEntity>): Promise<WarehouseEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: WarehouseEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
  updateStock(
    id: string,
    amountOccupiedDelta: number,
    amountAvailableDelta: number,
  ): Promise<WarehouseEntity | null>;
}
