import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => (value != null ? roundToTwo(value) : undefined))
  @ApiProperty({ example: 0, required: false, description: 'Số tiền thanh toán (mặc định 0)' })
  payment?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Khách VIP', required: false })
  note?: string;
}
