import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order.dto.js';

export class UpdateOrderProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Set A', required: false })
  nameSet?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false })
  priceSet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false })
  quantitySet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false })
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
  @IsNumber()
  @ApiProperty({ example: 1600, required: false })
  exchangeRate?: number;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', required: false })
  customer?: string;

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
