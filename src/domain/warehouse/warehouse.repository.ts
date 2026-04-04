import { WarehouseEntity } from './warehouse.entity.js';

export interface IWarehouseRepository {
  findById(id: string): Promise<WarehouseEntity | null>;
  findByAttributes(
    inchId: string,
    itemId: string,
    qualityId: string,
    styleId: string,
    colorId: string,
  ): Promise<WarehouseEntity | null>;
  updateByCatalogId(
    field: 'inchId' | 'itemId' | 'qualityId' | 'styleId' | 'colorId',
    catalogId: string,
    nameField: 'inches' | 'item' | 'quality' | 'style' | 'color',
    newValue: string | number,
  ): Promise<void>;
  create(warehouse: Partial<WarehouseEntity>): Promise<WarehouseEntity>;
  update(
    id: string,
    data: Partial<WarehouseEntity>,
  ): Promise<WarehouseEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    canViewAllData?: boolean,
  ): Promise<{
    items: WarehouseEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
  updateStock(
    id: string,
    amountOccupiedDelta: number,
    amountAvailableDelta: number,
  ): Promise<WarehouseEntity | null>;
  decreaseTotalAndOccupied(
    id: string,
    quantity: number,
    anyPaymetKhachTra: boolean,
  ): Promise<WarehouseEntity | null>;
}
