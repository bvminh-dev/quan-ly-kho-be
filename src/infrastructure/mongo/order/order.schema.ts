import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  HistoryType,
  OrderState,
  OrderType,
  PaymentMethod,
} from '../../../common/enums/index.js';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  })
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  sale: number;

  @Prop({ default: false })
  customPrice: boolean;

  @Prop({ default: false })
  customSale: boolean;
}

@Schema({ _id: false })
export class OrderProduct {
  @Prop()
  nameSet: string;

  @Prop()
  priceSet: number;

  @Prop()
  quantitySet: number;

  @Prop()
  saleSet: number;

  @Prop({ default: false })
  isCalcSet: boolean;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];
}

@Schema({ _id: false })
export class OrderHistory {
  @Prop({ required: true, enum: HistoryType })
  type: string;

  @Prop({ required: true })
  exchangeRate: number;

  @Prop({ required: true })
  moneyPaidNGN: number;

  @Prop({ required: true })
  moneyPaidDolar: number;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: string;

  @Prop({ required: true, type: Date })
  datePaid: Date;

  @Prop()
  note: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, enum: OrderType })
  type: string;

  @Prop({ required: true, enum: OrderState, default: OrderState.BAO_GIA })
  state: string;

  @Prop({ required: true })
  exchangeRate: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  })
  customer: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ default: 0 })
  payment: number;

  @Prop()
  note: string;

  @Prop({ type: [OrderProduct], required: true })
  products: OrderProduct[];

  @Prop({ type: [OrderHistory], default: [] })
  history: OrderHistory[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  deleteBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
