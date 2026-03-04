export class HistoryEnterMetadata {
  totalAmount?: number;
  amountOccupied?: number;
  amountAvailable?: number;
  priceHigh?: number;
  priceLow?: number;
  sale?: number;
  quantity?: number;
  quantityRevert?: number;
  orderId?:
    | string
    | {
        _id?: string;
        type?: string;
        state?: string;
        totalPrice?: number;
        payment?: number;
        customer?: any;
        note?: string;
      };
  priceHighNew?: number;
  priceHighOld?: number;
  priceLowNew?: number;
  priceLowOld?: number;
  saleNew?: number;
  saleOld?: number;
  unitOfCalculation?: string;
}

export class HistoryEnterEntity {
  _id: string;
  warehouseId:
    | string
    | {
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
  type: string;
  metadata: HistoryEnterMetadata;
  note?: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<HistoryEnterEntity>) {
    Object.assign(this, partial);
  }
}
