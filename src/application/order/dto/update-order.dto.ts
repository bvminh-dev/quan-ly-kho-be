import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '../../../common/enums/index.js';
import { CreateOrderItemDto } from './create-order.dto.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class UpdateOrderProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Set A', required: false })
  nameSet?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false })
  @Type(() => Number)
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceSet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  quantitySet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false })
  @Type(() => Number)
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  saleSet?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  isCalcSet?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({ type: [CreateOrderItemDto] })
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderType)
  @ApiProperty({
    example: OrderType.CAO,
    enum: OrderType,
    required: false,
    description: 'Loại đơn theo giá cao hoặc giá thấp',
  })
  type?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1600, required: false })
  @Type(() => Number)
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  exchangeRate?: number;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', required: false })
  customer?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    example: 500000,
    required: false,
    description: 'Số tiền khách nợ cần trả vào hoá đơn này',
  })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  debt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    example: 100000,
    required: false,
    description: 'Số tiền khách trả dư, được trừ ở hoá đơn này',
  })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  paid?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú đơn hàng', required: false })
  note?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderProductDto)
  @ApiProperty({ type: [UpdateOrderProductDto], required: false })
  products?: UpdateOrderProductDto[];
}
