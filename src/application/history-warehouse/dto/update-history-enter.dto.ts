import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HistoryEnterType } from '../../../common/enums/index.js';

class HistoryEnterMetadataDto {
  @IsOptional()
  @ApiProperty({ example: 100, required: false })
  totalAmount?: number;

  @IsOptional()
  @ApiProperty({ example: 500, required: false })
  priceHigh?: number;

  @IsOptional()
  @ApiProperty({ example: 300, required: false })
  priceLow?: number;

  @IsOptional()
  @ApiProperty({ example: 0, required: false })
  sale?: number;

  @IsOptional()
  @ApiProperty({ example: 50, required: false })
  quantity?: number;

  @IsOptional()
  @ApiProperty({ example: 10, required: false })
  quantityRevert?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', required: false })
  orderId?: string;

  @IsOptional()
  @ApiProperty({ example: 600, required: false })
  priceHighNew?: number;

  @IsOptional()
  @ApiProperty({ example: 500, required: false })
  priceHighOld?: number;

  @IsOptional()
  @ApiProperty({ example: 400, required: false })
  priceLowNew?: number;

  @IsOptional()
  @ApiProperty({ example: 300, required: false })
  priceLowOld?: number;

  @IsOptional()
  @ApiProperty({ example: 10, required: false })
  saleNew?: number;

  @IsOptional()
  @ApiProperty({ example: 0, required: false })
  saleOld?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Kg', required: false })
  unitOfCalculation?: string;
}

export class UpdateHistoryEnterDto {
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
  @IsEnum(HistoryEnterType)
  @ApiProperty({
    example: HistoryEnterType.TAO_MOI,
    enum: HistoryEnterType,
    required: false,
  })
  type?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HistoryEnterMetadataDto)
  @ApiProperty({ type: HistoryEnterMetadataDto, required: false })
  metadata?: HistoryEnterMetadataDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú', required: false })
  note?: string;
}
