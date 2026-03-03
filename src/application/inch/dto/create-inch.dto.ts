import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateInchDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+$/, {
    message: 'code chỉ được chứa chữ thường và số, không có dấu cách',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.toLowerCase().replace(/\s+/g, '')
      : value,
  )
  @ApiProperty({
    example: '14',
    description: 'Code viết liền không dấu viết thường và xóa khoảng trắng',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '14"', description: 'Tên hiển thị của inch' })
  name: string;
}
