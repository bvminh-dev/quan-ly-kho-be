import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
import { roundToTwo } from '../../../common/utils/number.util.js';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID warehouse',
  })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 5, description: 'Số lượng' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: 'Đơn giá' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
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
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
  priceSet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false, description: 'Số lượng set' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
  quantitySet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false, description: 'Giảm giá set' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
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
  @ApiProperty({
    example: OrderType.CAO,
    enum: OrderType,
    description: 'Loại đơn theo giá cao hoặc giá thấp',
  })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1600, description: 'Tỷ giá' })
  @Type(() => Number)
  @Transform(({ value }) => roundToTwo(value))
  exchangeRate: number;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID khách hàng',
  })
  customer: string;

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  @ApiProperty({ type: [CreateOrderProductDto] })
  products: CreateOrderProductDto[];
}
