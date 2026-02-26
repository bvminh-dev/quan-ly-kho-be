import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class AddStockDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của warehouse cần bổ sung hàng hóa',
  })
  warehouseId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: 50, description: 'Số lượng hàng hóa cần thêm' })
  @Transform(({ value }) => roundToTwo(value))
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nhập hàng từ nhà cung cấp ABC',
    required: false,
    description: 'Ghi chú về việc bổ sung hàng hóa',
  })
  note?: string;
}

export class AddStockBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của hàng hóa (warehouse) cần bổ sung',
  })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: 50, description: 'Số lượng hàng hóa cần thêm' })
  @Transform(({ value }) => roundToTwo(value))
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nhập hàng từ nhà cung cấp ABC',
    required: false,
    description: 'Ghi chú về việc bổ sung hàng hóa',
  })
  note?: string;
}
