import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { HistoryEnterType } from '../../../common/enums/index.js';

export type HistoryEnterDocument = HydratedDocument<HistoryEnter>;

@Schema({ _id: false })
export class HistoryEnterMetadata {
  @Prop()
  totalAmount?: number;

  @Prop()
  priceHigh?: number;

  @Prop()
  priceLow?: number;

  @Prop()
  sale?: number;

  @Prop()
  quantity?: number;

  @Prop()
  quantityRevert?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId?: mongoose.Schema.Types.ObjectId;

  @Prop()
  priceHighNew?: number;

  @Prop()
  priceHighOld?: number;

  @Prop()
  priceLowNew?: number;

  @Prop()
  priceLowOld?: number;

  @Prop()
  saleNew?: number;

  @Prop()
  saleOld?: number;
}

@Schema({ timestamps: true })
export class HistoryEnter {
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

  @Prop({ required: true, enum: HistoryEnterType })
  type: string;

  @Prop({ type: HistoryEnterMetadata, required: true })
  metadata: HistoryEnterMetadata;

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

export const HistoryEnterSchema = SchemaFactory.createForClass(HistoryEnter);
