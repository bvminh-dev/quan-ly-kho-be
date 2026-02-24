export class HistoryExportEntity {
  _id: string;
  warehouseId: string | {
    _id?: string;
    item?: string;
    inches?: number;
    quality?: string;
    style?: string;
    color?: string;
    priceHigh?: number;
    priceLow?: number;
    sale?: number;
    totalAmount?: number;
    amountOccupied?: number;
    amountAvailable?: number;
  };
  item: string;
  inches: number;
  quality: string;
  style: string;
  color: string;
  priceHigh: number;
  priceLow: number;
  sale: number;
  orderId: string | {
    _id?: string;
    type?: string;
    state?: string;
    totalPrice?: number;
    payment?: number;
    customer?: any;
    note?: string;
    products?: any[];
  };
  type: string;
  priceOrder: number;
  saleOrder: number;
  quantityOrder: number;
  stateOrder: string;
  paymentOrder: number;
  note?: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<HistoryExportEntity>) {
    Object.assign(this, partial);
  }
}
