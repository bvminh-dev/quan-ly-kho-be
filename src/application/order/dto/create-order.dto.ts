import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '../../../common/enums/index.js';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'ID warehouse' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 5, description: 'Số lượng' })
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: 'Đơn giá' })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá' })
  sale?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  customPrice?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  customSale?: boolean;
}

export class CreateOrderProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Set A', required: false })
  nameSet?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false, description: 'Giá set' })
  priceSet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false, description: 'Số lượng set' })
  quantitySet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá set' })
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

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderType)
  @ApiProperty({ example: OrderType.CAO, enum: OrderType, description: 'Loại đơn theo giá cao hoặc giá thấp' })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1600, description: 'Tỷ giá' })
  exchangeRate: number;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'ID khách hàng' })
  customer: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú đơn hàng', required: false })
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  @ApiProperty({ type: [CreateOrderProductDto] })
  products: CreateOrderProductDto[];
}
