import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateColorDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'NATURAL',
    required: false,
    description: 'Tên hiển thị của color',
  })
  name?: string;
}
