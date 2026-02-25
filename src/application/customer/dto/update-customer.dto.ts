import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Nguyễn Văn B', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Khách VIP', required: false })
  note?: string;
}
