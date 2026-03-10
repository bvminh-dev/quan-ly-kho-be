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
import type { OrderEntity } from '../../domain/order/order.entity.js';
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

    const allowedStates = [OrderState.DA_CHOT, OrderState.CHINH_SUA];
    if (!allowedStates.includes(order.state as OrderState)) {
      throw new BadRequestException(
        `Không thể hoàn đơn từ trạng thái "${order.state}". Chỉ cho phép hoàn đơn từ: ${allowedStates.join(', ')}`,
      );
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

    const zeroedProducts = order.products.map((product) => ({
      ...product,
      quantitySet: 0,
      items: product.items.map((item) => ({
        ...item,
        quantity: 0,
      })),
    }));

    const updated = await this.orderRepository.update(id, {
      state: OrderState.HOAN_TAC,
      updatedBy,
      note: dto.note,
      products: zeroedProducts,
    } as Partial<OrderEntity>);

    const customerPayment =
      await this.orderRepository.calculateCustomerPayment(customerId);

    await this.customerRepository.update(customerId, {
      payment: customerPayment,
    });

    return updated;
  }
}
