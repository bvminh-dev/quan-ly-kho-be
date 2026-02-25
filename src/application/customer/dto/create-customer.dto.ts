import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Khách VIP', required: false })
  note?: string;
}
