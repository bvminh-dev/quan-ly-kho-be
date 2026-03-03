import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInchDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '14"',
    required: false,
    description: 'Tên hiển thị của inch',
  })
  name?: string;
}
