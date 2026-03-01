import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeliverOrderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Giao hàng cho khách, kiểm tra đủ tiền',
    required: false,
    description: 'Ghi chú khi chuyển đơn sang trạng thái Đã giao',
  })
  note?: string;
}

