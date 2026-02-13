export class WarehouseEntity {
  _id: string;
  inches: number;
  item: string;
  quality: string;
  style: string;
  color: string;
  totalAmount: number;
  amountOccupied: number;
  amountAvailable: number;
  unitOfCalculation: string;
  priceHigh: number;
  priceLow: number;
  sale: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<WarehouseEntity>) {
    Object.assign(this, partial);
  }
}
