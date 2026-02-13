export class OrderItemEntity {
  id: string;
  quantity: number;
  price: number;
  sale: number;
  customPrice: boolean;
  customSale: boolean;
}

export class OrderProductEntity {
  nameSet?: string;
  priceSet?: number;
  quantitySet?: number;
  saleSet?: number;
  isCalcSet: boolean;
  items: OrderItemEntity[];
}

export class OrderHistoryEntity {
  type: string;
  exchangeRate: number;
  moneyPaidNGN: number;
  moneyPaidDolar: number;
  paymentMethod: string;
  datePaid: Date;
  note?: string;
}

export class OrderEntity {
  _id: string;
  state: string;
  exchangeRate: number;
  customer: string | { _id: string; name: string } | null;
  totalPrice: number;
  payment: number;
  note: string;
  products: OrderProductEntity[];
  history: OrderHistoryEntity[];
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }
}
