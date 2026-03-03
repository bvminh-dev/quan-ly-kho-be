import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStyleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'BONESTRAIGHT',
    required: false,
    description: 'Tên hiển thị của style',
  })
  name?: string;
}
