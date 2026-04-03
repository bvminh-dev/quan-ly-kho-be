import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  HistoryType,
  OrderState,
  OrderType,
  PaymentMethod,
  UnitOfCalculation,
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

  @Prop({ required: true, enum: UnitOfCalculation })
  unitOfCalculation: string;
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

  @Prop()
  paymentType: string;
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
  totalUsd: number;

  @Prop({ default: 0 })
  paidedUsd: number;

  @Prop({ default: 0 })
  debt: number;

  @Prop({ default: 0 })
  paid: number;

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

  @Prop()
  deliveredAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ state: 1, deliveredAt: -1, isDeleted: 1 });
OrderSchema.index({ customer: 1, state: 1, createdAt: -1, isDeleted: 1 });
OrderSchema.index({ customer: 1, state: 1, isDeleted: 1 });
OrderSchema.index({ state: 1, createdAt: -1, isDeleted: 1 });
OrderSchema.index({ createdAt: -1, isDeleted: 1 });
OrderSchema.index({ type: 1, isDeleted: 1 });
OrderSchema.index({ createdBy: 1, isDeleted: 1 });
