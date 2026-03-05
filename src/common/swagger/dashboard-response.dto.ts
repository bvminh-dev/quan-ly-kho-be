import { ApiProperty } from '@nestjs/swagger';

class DashboardOrdersDataDto {
  @ApiProperty({ example: 25, description: 'Tổng số đơn hàng' })
  totalOrders: number;

  @ApiProperty({ example: 150.5, description: 'Tổng số lượng (Kg)' })
  totalOrdersKg: number;

  @ApiProperty({ example: 30, description: 'Tổng số lượng (Pcs)' })
  totalOrdersPcs: number;

  @ApiProperty({ example: 3125.5, description: 'Tổng giá trị đơn hàng (USD)' })
  totalValueUSD: number;

  @ApiProperty({ example: 40000000, description: 'Tổng thu về (NGN)' })
  totalCollectedNGN: number;

  @ApiProperty({ example: 2500.25, description: 'Tổng thu về (USD)' })
  totalCollectedUSD: number;
}

export class GetDashboardOrdersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch dashboard orders report' })
  message: string;

  @ApiProperty({ type: () => DashboardOrdersDataDto })
  data: DashboardOrdersDataDto;
}

class DashboardCustomerItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  customerId: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  customerName: string;

  @ApiProperty({ example: 10, description: 'Tổng số đơn hàng' })
  totalOrders: number;

  @ApiProperty({ example: 100.5, description: 'Tổng số lượng (Kg)' })
  totalOrdersKg: number;

  @ApiProperty({ example: 20, description: 'Tổng số lượng (Pcs)' })
  totalOrdersPcs: number;

  @ApiProperty({ example: 30000000, description: 'Tổng đã trả (NGN)' })
  totalPaidNGN: number;

  @ApiProperty({ example: 1875, description: 'Tổng đã trả (USD)' })
  totalPaidUSD: number;

  @ApiProperty({ example: 625, description: 'Tổng nợ (USD)' })
  totalDebtUSD: number;
}

export class GetDashboardCustomersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch dashboard customers report' })
  message: string;

  @ApiProperty({ type: () => [DashboardCustomerItemDto] })
  data: DashboardCustomerItemDto[];
}

class DashboardStaffItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109cb' })
  staffId: string;

  @ApiProperty({ example: 'Nguyễn Văn B' })
  staffName: string;

  @ApiProperty({ example: 8, description: 'Tổng số đơn hàng' })
  totalOrders: number;

  @ApiProperty({ example: 80.5, description: 'Tổng số lượng (Kg)' })
  totalOrdersKg: number;

  @ApiProperty({ example: 10, description: 'Tổng số lượng (Pcs)' })
  totalOrdersPcs: number;

  @ApiProperty({ example: 15, description: 'Tổng số khách hàng' })
  totalCustomers: number;

  @ApiProperty({ example: 2500, description: 'Tổng giá trị (USD)' })
  totalValueUSD: number;

  @ApiProperty({ example: 32000000, description: 'Tổng thu về (NGN)' })
  totalCollectedNGN: number;

  @ApiProperty({ example: 2000, description: 'Tổng thu về (USD)' })
  totalCollectedUSD: number;
}

export class GetDashboardStaffResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch dashboard staff report' })
  message: string;

  @ApiProperty({ type: () => [DashboardStaffItemDto] })
  data: DashboardStaffItemDto[];
}
