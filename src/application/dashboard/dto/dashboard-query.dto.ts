import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DashboardPeriod } from '../../../common/enums/index.js';

export class DashboardQueryDto {
  @ApiProperty({
    enum: DashboardPeriod,
    description: 'Kỳ báo cáo: day | month | year',
    example: 'month',
  })
  @IsNotEmpty()
  @IsEnum(DashboardPeriod)
  period: DashboardPeriod;

  @ApiProperty({
    description:
      'Ngày ISO theo kỳ: 2026-03-02 (day), 2026-03 (month), 2026 (year)',
    example: '2026-03',
  })
  @IsNotEmpty()
  @IsString()
  date: string;
}
