import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  WarehouseInches,
  WarehouseItem,
  WarehouseQuality,
  WarehouseStyle,
  WarehouseColor,
  UnitOfCalculation,
} from '../../../common/enums/index.js';

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ required: true, enum: WarehouseInches })
  inches: number;

  @Prop({ required: true, enum: WarehouseItem })
  item: string;

  @Prop({ required: true, enum: WarehouseQuality })
  quality: string;

  @Prop({ required: true, enum: WarehouseStyle })
  style: string;

  @Prop({ required: true, enum: WarehouseColor })
  color: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  amountOccupied: number;

  @Prop({ default: 0 })
  amountAvailable: number;

  @Prop({ required: true, enum: UnitOfCalculation })
  unitOfCalculation: string;

  @Prop({ default: 0 })
  priceHigh: number;

  @Prop({ default: 0 })
  priceLow: number;

  @Prop({ default: 0 })
  sale: number;

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

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
