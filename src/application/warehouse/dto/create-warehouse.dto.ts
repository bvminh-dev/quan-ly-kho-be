import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import {
  WarehouseInches,
  WarehouseItem,
  WarehouseQuality,
  WarehouseStyle,
  WarehouseColor,
  UnitOfCalculation,
} from '../../../common/enums/index.js';

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsEnum(WarehouseInches)
  @ApiProperty({ example: 14, enum: WarehouseInches })
  inches: number;

  @IsNotEmpty()
  @IsEnum(WarehouseItem)
  @ApiProperty({ example: WarehouseItem.CLOSURE, enum: WarehouseItem })
  item: string;

  @IsNotEmpty()
  @IsEnum(WarehouseQuality)
  @ApiProperty({ example: WarehouseQuality.SDD, enum: WarehouseQuality })
  quality: string;

  @IsNotEmpty()
  @IsEnum(WarehouseStyle)
  @ApiProperty({ example: WarehouseStyle.BONESTRAIGHT, enum: WarehouseStyle })
  style: string;

  @IsNotEmpty()
  @IsEnum(WarehouseColor)
  @ApiProperty({ example: WarehouseColor.NATURAL, enum: WarehouseColor })
  color: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: 'Tổng số lượng' })
  totalAmount: number;

  @IsNotEmpty()
  @IsEnum(UnitOfCalculation)
  @ApiProperty({ example: UnitOfCalculation.KG, enum: UnitOfCalculation })
  unitOfCalculation: string;

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
