import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RevertOrderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Ghi chú hoàn tác đơn hàng', required: false, description: 'Ghi chú khi hoàn tác đơn hàng' })
  note?: string;
}
