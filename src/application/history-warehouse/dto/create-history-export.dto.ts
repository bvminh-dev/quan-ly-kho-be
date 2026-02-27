import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HistoryExportState, OrderType } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class CreateHistoryExportDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    required: true,
    description: 'Id warehouse',
  })
  warehouseId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'CLOSURE',
    required: true,
    description: 'Item từ warehouse',
  })
  item: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 14,
    required: true,
    description: 'Inches từ warehouse',
  })
  inches: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'SDD',
    required: true,
    description: 'Quality từ warehouse',
  })
  quality: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'BONESTRAIGHT',
    required: true,
    description: 'Style từ warehouse',
  })
  style: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'NATURAL',
    required: true,
    description: 'Color từ warehouse',
  })
  color: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 500,
    required: true,
    description: 'Giá cao từ warehouse',
  })
  @Transform(({ value }) => roundToTwo(value))
  priceHigh: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 300,
    required: true,
    description: 'Giá thấp từ warehouse',
  })
  @Transform(({ value }) => roundToTwo(value))
  priceLow: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 0,
    required: true,
    description: 'Giảm giá từ warehouse',
  })
  @Transform(({ value }) => roundToTwo(value))
  sale: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    required: true,
    description: 'Id đơn hàng',
  })
  orderId: string;

  @IsNotEmpty()
  @IsEnum(OrderType)
  @ApiProperty({
    example: OrderType.CAO,
    enum: OrderType,
    required: true,
    description: 'Loại đơn theo giá cao hoặc giá thấp',
  })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 500,
    required: true,
    description: 'Giá bán của đơn hàng lúc đó',
  })
  @Transform(({ value }) => roundToTwo(value))
  priceOrder: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 0,
    required: true,
    description: 'Giá sale của đơn hàng lúc đó',
  })
  @Transform(({ value }) => roundToTwo(value))
  saleOrder: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 10,
    required: true,
    description: 'Tổng số lượng bán của đơn hàng lúc đó',
  })
  @Transform(({ value }) => roundToTwo(value))
  quantityOrder: number;

  @IsNotEmpty()
  @IsEnum(HistoryExportState)
  @ApiProperty({
    example: HistoryExportState.KHACH_TRA,
    enum: HistoryExportState,
    required: true,
    description: 'Trạng thái đơn: Báo giá | Khách trả | Hoàn đơn | Đã xong',
  })
  stateOrder: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 5000,
    required: true,
    description:
      'Số tiền khách vừa trả (giá trị dương), số tiền vừa hoàn đơn (giá trị âm)',
  })
  @Transform(({ value }) => roundToTwo(value))
  paymentOrder: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú', required: false, description: 'Ghi chú' })
  note?: string;
}
