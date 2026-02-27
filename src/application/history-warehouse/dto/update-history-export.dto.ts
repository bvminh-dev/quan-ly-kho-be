import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { HistoryExportState, OrderType } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class UpdateHistoryExportDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', required: false })
  warehouseId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'CLOSURE', required: false })
  item?: string;

  @IsOptional()
  @ApiProperty({ example: 14, required: false })
  inches?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'SDD', required: false })
  quality?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'BONESTRAIGHT', required: false })
  style?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'NATURAL', required: false })
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceHigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 300, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceLow?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  sale?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60d0fe4f5311236168a109cb', required: false })
  orderId?: string;

  @IsOptional()
  @IsEnum(OrderType)
  @ApiProperty({ example: OrderType.CAO, enum: OrderType, required: false })
  type?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 500, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  priceOrder?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  saleOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 10, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  quantityOrder?: number;

  @IsOptional()
  @IsEnum(HistoryExportState)
  @ApiProperty({
    example: HistoryExportState.KHACH_TRA,
    enum: HistoryExportState,
    required: false,
    description: 'Trạng thái đơn: Báo giá | Khách trả | Hoàn đơn | Đã xong',
  })
  stateOrder?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 5000, required: false })
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  paymentOrder?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú', required: false })
  note?: string;
}
