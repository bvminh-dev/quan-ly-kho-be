import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { UnitOfCalculation } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của inch từ catalog',
  })
  inchId: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của item từ catalog',
  })
  itemId: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cc',
    description: 'ID của quality từ catalog',
  })
  qualityId: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cd',
    description: 'ID của style từ catalog',
  })
  styleId: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ce',
    description: 'ID của color từ catalog',
  })
  colorId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: 'Tổng số lượng' })
  @Transform(({ value }) => roundToTwo(value))
  totalAmount: number;

  @IsNotEmpty()
  @IsEnum(UnitOfCalculation)
  @ApiProperty({ example: UnitOfCalculation.KG, enum: UnitOfCalculation })
  unitOfCalculation: string;

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
