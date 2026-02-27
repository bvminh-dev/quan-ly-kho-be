import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import {
  WarehouseInches,
  WarehouseItem,
  WarehouseQuality,
  WarehouseStyle,
  WarehouseColor,
  UnitOfCalculation,
} from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsEnum(WarehouseInches)
  @ApiProperty({ example: 14, enum: WarehouseInches, required: false })
  inches?: number;

  @IsOptional()
  @IsEnum(WarehouseItem)
  @ApiProperty({
    example: WarehouseItem.CLOSURE,
    enum: WarehouseItem,
    required: false,
  })
  item?: string;

  @IsOptional()
  @IsEnum(WarehouseQuality)
  @ApiProperty({
    example: WarehouseQuality.SDD,
    enum: WarehouseQuality,
    required: false,
  })
  quality?: string;

  @IsOptional()
  @IsEnum(WarehouseStyle)
  @ApiProperty({
    example: WarehouseStyle.BONESTRAIGHT,
    enum: WarehouseStyle,
    required: false,
  })
  style?: string;

  @IsOptional()
  @IsEnum(WarehouseColor)
  @ApiProperty({
    example: WarehouseColor.NATURAL,
    enum: WarehouseColor,
    required: false,
  })
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, required: false, description: 'Tổng số lượng' })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 0,
    required: false,
    description: 'Số lượng chiếm dụng',
  })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  amountOccupied?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 100,
    required: false,
    description: 'Số lượng khả dụng',
  })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  amountAvailable?: number;

  @IsOptional()
  @IsEnum(UnitOfCalculation)
  @ApiProperty({
    example: UnitOfCalculation.KG,
    enum: UnitOfCalculation,
    required: false,
  })
  unitOfCalculation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false, description: 'Giá cao' })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceHigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 300, required: false, description: 'Giá thấp' })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceLow?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá' })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  sale?: number;
}
