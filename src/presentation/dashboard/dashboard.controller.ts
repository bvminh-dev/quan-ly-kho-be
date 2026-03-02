import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetDashboardCustomersUseCase } from '../../application/dashboard/get-dashboard-customers.usecase.js';
import { GetDashboardOrdersUseCase } from '../../application/dashboard/get-dashboard-orders.usecase.js';
import { GetDashboardStaffUseCase } from '../../application/dashboard/get-dashboard-staff.usecase.js';
import { DashboardQueryDto } from '../../application/dashboard/dto/dashboard-query.dto.js';
import { AllowAllAuthenticated } from '../../common/decorators/allow-all-authenticated.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import {
  GetDashboardCustomersResponseDto,
  GetDashboardOrdersResponseDto,
  GetDashboardStaffResponseDto,
} from '../../common/swagger/dashboard-response.dto.js';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardOrdersUseCase: GetDashboardOrdersUseCase,
    private readonly getDashboardCustomersUseCase: GetDashboardCustomersUseCase,
    private readonly getDashboardStaffUseCase: GetDashboardStaffUseCase,
  ) {}

  @Get('orders')
  @AllowAllAuthenticated()
  @ApiOperation({ summary: 'Báo cáo tổng hợp theo đơn hàng trong kỳ' })
  @ApiQuery({
    name: 'period',
    required: true,
    enum: ['day', 'month', 'year'],
    description: 'Kỳ báo cáo',
    example: 'month',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description:
      'Ngày ISO theo kỳ: 2026-03-02 (day), 2026-03 (month), 2026 (year)',
    example: '2026-03',
  })
  @ApiOkResponse({
    description: 'Trả về báo cáo tổng hợp đơn hàng',
    type: GetDashboardOrdersResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch dashboard orders report')
  async getOrders(@Query() query: DashboardQueryDto) {
    return this.getDashboardOrdersUseCase.execute(query);
  }

  @Get('customers')
  @AllowAllAuthenticated()
  @ApiOperation({ summary: 'Báo cáo tổng hợp theo khách hàng trong kỳ' })
  @ApiQuery({
    name: 'period',
    required: true,
    enum: ['day', 'month', 'year'],
    description: 'Kỳ báo cáo',
    example: 'month',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description:
      'Ngày ISO theo kỳ: 2026-03-02 (day), 2026-03 (month), 2026 (year)',
    example: '2026-03',
  })
  @ApiOkResponse({
    description: 'Trả về báo cáo tổng hợp theo khách hàng',
    type: GetDashboardCustomersResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch dashboard customers report')
  async getCustomers(@Query() query: DashboardQueryDto) {
    return this.getDashboardCustomersUseCase.execute(query);
  }

  @Get('staff')
  @AllowAllAuthenticated()
  @ApiOperation({ summary: 'Báo cáo tổng hợp theo nhân viên bán hàng trong kỳ' })
  @ApiQuery({
    name: 'period',
    required: true,
    enum: ['day', 'month', 'year'],
    description: 'Kỳ báo cáo',
    example: 'month',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description:
      'Ngày ISO theo kỳ: 2026-03-02 (day), 2026-03 (month), 2026 (year)',
    example: '2026-03',
  })
  @ApiOkResponse({
    description: 'Trả về báo cáo tổng hợp theo nhân viên',
    type: GetDashboardStaffResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch dashboard staff report')
  async getStaff(@Query() query: DashboardQueryDto) {
    return this.getDashboardStaffUseCase.execute(query);
  }
}
