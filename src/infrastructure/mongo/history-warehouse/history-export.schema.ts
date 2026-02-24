import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { HistoryExportState, OrderType } from '../../../common/enums/index.js';

export type HistoryExportDocument = HydratedDocument<HistoryExport>;

@Schema({ timestamps: true })
export class HistoryExport {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  })
  warehouseId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  inches: number;

  @Prop({ required: true })
  quality: string;

  @Prop({ required: true })
  style: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  priceHigh: number;

  @Prop({ required: true })
  priceLow: number;

  @Prop({ required: true })
  sale: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: OrderType })
  type: string;

  @Prop({ required: true })
  priceOrder: number;

  @Prop({ required: true })
  saleOrder: number;

  @Prop({ required: true })
  quantityOrder: number;

  @Prop({ required: true, enum: HistoryExportState })
  stateOrder: string;

  @Prop({ required: true })
  paymentOrder: number;

  @Prop()
  note?: string;

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

export const HistoryExportSchema = SchemaFactory.createForClass(HistoryExport);
