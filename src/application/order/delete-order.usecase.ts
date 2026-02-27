import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderState } from '../../common/enums/index.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';

@Injectable()
export class DeleteOrderUseCase {
  private readonly logger = new Logger(DeleteOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if ((order.state as OrderState) === OrderState.DA_XONG) {
      throw new BadRequestException(
        'Không thể xóa đơn hàng đã hoàn thành. Vui lòng sử dụng chức năng hoàn đơn.',
      );
    }

    if ((order.state as OrderState) !== OrderState.HOAN_TAC) {
      for (const product of order.products) {
        for (const item of product.items) {
          await this.warehouseRepository.updateStock(
            item.id,
            -item.quantity,
            item.quantity,
          );

          await this.historyWarehouseService.createHistoryEnterForRevertOrder(
            item.id,
            id,
            item.quantity,
            `Xóa đơn hàng ${id}`,
            deleteBy,
          );
        }
      }
    }

    await this.orderRepository.softDelete(id, deleteBy);

    if ((order.state as OrderState) !== OrderState.BAO_GIA) {
      const customerId =
        typeof order.customer === 'object' && order.customer !== null
          ? order.customer._id
          : (order.customer as string);

      const customerPayment =
        await this.orderRepository.calculateCustomerPayment(customerId);

      await this.customerRepository.update(customerId, {
        payment: customerPayment,
      });
    }
  }
}
