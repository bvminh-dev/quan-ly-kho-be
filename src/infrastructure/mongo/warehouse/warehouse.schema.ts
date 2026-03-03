import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UnitOfCalculation } from '../../../common/enums/index.js';

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Inch' })
  inchId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  itemId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quality' })
  qualityId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Style' })
  styleId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Color' })
  colorId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  inches: number;

  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  quality: string;

  @Prop({ required: true })
  style: string;

  @Prop({ required: true })
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

WarehouseSchema.index(
  {
    inchId: 1,
    itemId: 1,
    qualityId: 1,
    styleId: 1,
    colorId: 1,
  },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  },
);
