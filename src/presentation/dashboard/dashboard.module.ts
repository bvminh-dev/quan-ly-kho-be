import { Module } from '@nestjs/common';
import { GetDashboardCustomersUseCase } from '../../application/dashboard/get-dashboard-customers.usecase.js';
import { GetDashboardOrdersUseCase } from '../../application/dashboard/get-dashboard-orders.usecase.js';
import { GetDashboardStaffUseCase } from '../../application/dashboard/get-dashboard-staff.usecase.js';
import { OrderModule } from '../order/order.module.js';
import { DashboardController } from './dashboard.controller.js';

@Module({
  imports: [OrderModule],
  controllers: [DashboardController],
  providers: [
    GetDashboardOrdersUseCase,
    GetDashboardCustomersUseCase,
    GetDashboardStaffUseCase,
  ],
})
export class DashboardModule {}
