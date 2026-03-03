import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'CLOSURE',
    required: false,
    description: 'Tên hiển thị của item',
  })
  name?: string;
}
