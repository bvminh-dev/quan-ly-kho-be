import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0, required: false, description: 'Số tiền khách nợ hoặc trả thừa' })
  payment?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Khách VIP', required: false })
  note?: string;
}
