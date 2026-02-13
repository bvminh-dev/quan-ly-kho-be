import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import {
  WarehouseInches,
  WarehouseItem,
  WarehouseQuality,
  WarehouseStyle,
  WarehouseColor,
  UnitOfCalculation,
} from '../../../common/enums/index.js';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsEnum(WarehouseInches)
  @ApiProperty({ example: 14, enum: WarehouseInches, required: false })
  inches?: number;

  @IsOptional()
  @IsEnum(WarehouseItem)
  @ApiProperty({ example: WarehouseItem.CLOSURE, enum: WarehouseItem, required: false })
  item?: string;

  @IsOptional()
  @IsEnum(WarehouseQuality)
  @ApiProperty({ example: WarehouseQuality.SDD, enum: WarehouseQuality, required: false })
  quality?: string;

  @IsOptional()
  @IsEnum(WarehouseStyle)
  @ApiProperty({ example: WarehouseStyle.BONESTRAIGHT, enum: WarehouseStyle, required: false })
  style?: string;

  @IsOptional()
  @IsEnum(WarehouseColor)
  @ApiProperty({ example: WarehouseColor.NATURAL, enum: WarehouseColor, required: false })
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, required: false, description: 'Tổng số lượng' })
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Số lượng chiếm dụng' })
  amountOccupied?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, required: false, description: 'Số lượng khả dụng' })
  amountAvailable?: number;

  @IsOptional()
  @IsEnum(UnitOfCalculation)
  @ApiProperty({ example: UnitOfCalculation.KG, enum: UnitOfCalculation, required: false })
  unitOfCalculation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false, description: 'Giá cao' })
  priceHigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 300, required: false, description: 'Giá thấp' })
  priceLow?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá' })
  sale?: number;
}
