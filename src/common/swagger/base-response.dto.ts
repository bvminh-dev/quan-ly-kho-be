import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Trang hiện tại' })
  current: number;

  @ApiProperty({ example: 10, description: 'Số bản ghi mỗi trang' })
  pageSize: number;

  @ApiProperty({ example: 5, description: 'Tổng số trang' })
  pages: number;

  @ApiProperty({ example: 50, description: 'Tổng số bản ghi' })
  total: number;
}
