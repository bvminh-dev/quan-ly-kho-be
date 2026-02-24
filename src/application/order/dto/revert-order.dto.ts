import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RevertOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Ghi chú hoàn tác đơn hàng', required: true, description: 'Ghi chú khi hoàn tác đơn hàng (bắt buộc)' })
  note: string;
}
