import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderState } from '../../common/enums/index.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class ConfirmOrderUseCase {
  private readonly logger = new Logger(ConfirmOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(id: string, updatedBy: string) {
    this.logger.log(`Confirming order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if ((order.state as OrderState) === OrderState.DA_CHOT) {
      throw new BadRequestException('Đơn hàng đã được chốt rồi');
    }

    if ((order.state as OrderState) === OrderState.HOAN_TAC) {
      throw new BadRequestException('Không thể chốt đơn hàng đã hoàn tác');
    }

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    if (!order.exchangeRate || order.exchangeRate <= 0) {
      throw new BadRequestException('Tỷ giá của đơn hàng không hợp lệ');
    }

    if ((order.state as OrderState) === OrderState.BAO_GIA) {
      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        throw new NotFoundException(
          `Khách hàng với id ${customerId} không tồn tại`,
        );
      }
      const orderPaid = roundToTwo(order.paid ?? 0);
      const customerPayment = roundToTwo(customer.payment ?? 0);
      if (orderPaid > customerPayment && orderPaid > 0) {
        throw new BadRequestException(
          'Số tiền Paid vượt quá số dư của khách hàng, hãy kiểm tra lại Paid',
        );
      }
    }

    // Kiểm tra số lượng hàng trong kho trước khi chốt đơn
    for (const product of order.products) {
      const quantitySet = product.quantitySet ?? 1;
      for (const item of product.items) {
        const warehouse = await this.warehouseRepository.findById(item.id);
        if (!warehouse) {
          throw new NotFoundException(
            `Hàng với id ${item.id} không tồn tại trong kho`,
          );
        }

        const requiredQuantity = roundToTwo(quantitySet * item.quantity);

        if (warehouse.amountAvailable < requiredQuantity) {
          const productName = `${warehouse.inches}" ${warehouse.item} ${warehouse.quality} ${warehouse.style} ${warehouse.color}`;
          throw new BadRequestException(
            `Hàng ${productName} không đủ trong kho. Hiện có: ${warehouse.amountAvailable}, yêu cầu: ${requiredQuantity}`,
          );
        }
      }
    }

    const updated = await this.orderRepository.update(id, {
      state: OrderState.DA_CHOT,
      updatedBy,
    });

    const customerPayment =
      await this.orderRepository.calculateCustomerPayment(customerId);

    await this.customerRepository.update(customerId, {
      payment: customerPayment,
    });

    this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_CONFIRMED, {
      orderId: id,
      updatedBy,
    });

    return updated;
  }
}
