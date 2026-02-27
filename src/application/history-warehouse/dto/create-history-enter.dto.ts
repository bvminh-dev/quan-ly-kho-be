import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HistoryEnterType } from '../../../common/enums/index.js';

class HistoryEnterMetadataDto {
  @IsOptional()
  @ApiProperty({
    example: 100,
    required: false,
    description: 'Tổng số lượng (khi type = Tạo mới)',
  })
  totalAmount?: number;

  @IsOptional()
  @ApiProperty({
    example: 500,
    required: false,
    description: 'Giá cao (khi type = Tạo mới)',
  })
  priceHigh?: number;

  @IsOptional()
  @ApiProperty({
    example: 300,
    required: false,
    description: 'Giá thấp (khi type = Tạo mới)',
  })
  priceLow?: number;

  @IsOptional()
  @ApiProperty({
    example: 0,
    required: false,
    description: 'Giảm giá (khi type = Tạo mới)',
  })
  sale?: number;

  @IsOptional()
  @ApiProperty({
    example: 50,
    required: false,
    description: 'Số lượng nhập thêm (khi type = nhập thêm hàng)',
  })
  quantity?: number;

  @IsOptional()
  @ApiProperty({
    example: 10,
    required: false,
    description: 'Số lượng hoàn đơn (khi type = hoàn đơn)',
  })
  quantityRevert?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    required: false,
    description: 'Id đơn hàng bị hoàn (khi type = hoàn đơn)',
  })
  orderId?: string;

  @IsOptional()
  @ApiProperty({
    example: 600,
    required: false,
    description: 'Giá cao mới (khi type = sửa giá)',
  })
  priceHighNew?: number;

  @IsOptional()
  @ApiProperty({
    example: 500,
    required: false,
    description: 'Giá cao cũ (khi type = sửa giá)',
  })
  priceHighOld?: number;

  @IsOptional()
  @ApiProperty({
    example: 400,
    required: false,
    description: 'Giá thấp mới (khi type = sửa giá)',
  })
  priceLowNew?: number;

  @IsOptional()
  @ApiProperty({
    example: 300,
    required: false,
    description: 'Giá thấp cũ (khi type = sửa giá)',
  })
  priceLowOld?: number;

  @IsOptional()
  @ApiProperty({
    example: 10,
    required: false,
    description: 'Sale mới (khi type = sửa giá)',
  })
  saleNew?: number;

  @IsOptional()
  @ApiProperty({
    example: 0,
    required: false,
    description: 'Sale cũ (khi type = sửa giá)',
  })
  saleOld?: number;
}

export class CreateHistoryEnterDto {
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
  @IsEnum(HistoryEnterType)
  @ApiProperty({
    example: HistoryEnterType.TAO_MOI,
    enum: HistoryEnterType,
    required: true,
    description: 'Loại nhập kho',
  })
  type: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => HistoryEnterMetadataDto)
  @ApiProperty({
    type: HistoryEnterMetadataDto,
    required: true,
    description: 'Metadata theo từng loại type',
  })
  metadata: HistoryEnterMetadataDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú', required: false, description: 'Ghi chú' })
  note?: string;
}
