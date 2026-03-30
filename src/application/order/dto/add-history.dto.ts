import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HistoryType, PaymentMethod } from '../../../common/enums/index.js';
import { roundToTwo } from '../../../common/utils/number.util.js';

export class AddHistoryDto {
  @IsNotEmpty()
  @IsEnum(HistoryType)
  @ApiProperty({ example: HistoryType.KHACH_TRA, enum: HistoryType })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1600, description: 'Tỷ giá' })
  @Transform(({ value }) => roundToTwo(value))
  exchangeRate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 50000, description: 'Tiền theo đơn vị NGN' })
  @Transform(({ value }) => roundToTwo(value))
  moneyPaidNGN: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 31.25, description: 'Tiền theo đơn vị Dolar' })
  @Transform(({ value }) => roundToTwo(value))
  moneyPaidDolar: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ example: PaymentMethod.CHUYEN_KHOAN, enum: PaymentMethod })
  paymentMethod: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '2026-02-15T11:51:00.000Z',
    description: 'Ngày trả (ISO 8601)',
    type: Date,
  })
  datePaid: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú thanh toán', required: false })
  note?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'auto | manual', required: false })
  paymentType?: string;
}
