import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { UnitOfCalculation } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    required: false,
    description: 'ID của inch từ catalog',
  })
  inchId?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    required: false,
    description: 'ID của item từ catalog',
  })
  itemId?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cc',
    required: false,
    description: 'ID của quality từ catalog',
  })
  qualityId?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cd',
    required: false,
    description: 'ID của style từ catalog',
  })
  styleId?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ce',
    required: false,
    description: 'ID của color từ catalog',
  })
  colorId?: string;

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
