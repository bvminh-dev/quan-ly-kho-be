import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HistoryType, OrderState } from '../../common/enums/index.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { HistoryWarehouseService } from '../history-warehouse/history-warehouse.service.js';
import { RevertOrderDto } from './dto/revert-order.dto.js';

@Injectable()
export class RevertOrderUseCase {
  private readonly logger = new Logger(RevertOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    private readonly historyWarehouseService: HistoryWarehouseService,
  ) {}

  async execute(id: string, dto: RevertOrderDto, updatedBy: string) {
    this.logger.log(`Reverting order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if ((order.state as OrderState) === OrderState.HOAN_TAC) {
      throw new BadRequestException('Đơn hàng đã được hoàn tác rồi');
    }

    if (order.paidedUsd > 0) {
      throw new BadRequestException('Phải trả lại khách đủ tiền mới hoàn tác');
    }

    const hasPaymentHistory = order.history.some(
      (h) =>
        (h.type?.toLowerCase() ?? '') === HistoryType.KHACH_TRA.toLowerCase(),
    );

    if (hasPaymentHistory) {
      for (const product of order.products) {
        for (const item of product.items) {
          const quantitySet = product.quantitySet ?? 1;
          const occupiedQuantity = roundToTwo(quantitySet * item.quantity);

          await this.warehouseRepository.updateStock(
            item.id,
            -occupiedQuantity,
            occupiedQuantity,
          );

          await this.historyWarehouseService.createHistoryEnterForRevertOrder(
            item.id,
            id,
            occupiedQuantity,
            dto.note ?? '',
            updatedBy,
          );
        }
      }
    }

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    const updateData: Partial<{
      state: string;
      updatedBy: string;
      note: string;
    }> = {
      state: OrderState.HOAN_TAC,
      updatedBy,
      note: dto.note,
    };

    const updated = await this.orderRepository.update(id, updateData as any);

    const customerPayment =
      await this.orderRepository.calculateCustomerPayment(customerId);

    await this.customerRepository.update(customerId, {
      payment: customerPayment,
    });

    return updated;
  }
}
