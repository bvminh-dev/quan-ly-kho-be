import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateQualityDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'SDD',
    required: false,
    description: 'Tên hiển thị của quality',
  })
  name?: string;
}
