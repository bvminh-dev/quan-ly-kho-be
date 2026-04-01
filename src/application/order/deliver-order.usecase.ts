import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import { HistoryType, OrderState } from '../../common/enums/index.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class DeliverOrderUseCase {
  private readonly logger = new Logger(DeliverOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(id: string, updatedBy: string, note?: string) {
    this.logger.log(`Delivering order ${id}`);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    const currentState = order.state as OrderState;

    // Chỉ cho phép chuyển từ Báo giá, Đã chốt, Chỉnh sửa sang Đã giao
    if (
      currentState !== OrderState.BAO_GIA &&
      currentState !== OrderState.DA_CHOT &&
      currentState !== OrderState.CHINH_SUA
    ) {
      throw new BadRequestException(
        `Không thể chuyển đơn hàng từ trạng thái "${currentState}" sang "Đã giao"`,
      );
    }

    // Không cần kiểm tra khách có nợ hay không vẫn phải chuyển trạng thái dã giao
    // if (order.payment < 0) {
    //   throw new BadRequestException(
    //     'Không thể chuyển đơn hàng sang "Đã giao" khi khách hàng còn nợ',
    //   );
    // }

    // Trừ số lượng trong kho (totalAmount và amountOccupied) khi chuyển sang Đã giao
    // Chỉ thực hiện một lần duy nhất tại thời điểm chuyển trạng thái
    const anyPaymetKhachTra = order.history.some(
      (h) => h.type === HistoryType.KHACH_TRA.toLowerCase(),
    );
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const totalQuantity = roundToTwo(quantitySet * item.quantity);

        await this.warehouseRepository.decreaseTotalAndOccupied(
          item.id,
          totalQuantity,
          anyPaymetKhachTra,
        );
      }
    }

    const updateData: Partial<any> = {
      state: OrderState.DA_GIAO,
      deliveredAt: new Date(),
      updatedBy,
    };

    if (note) {
      updateData.note = note;
    }

    const updated = await this.orderRepository.update(id, updateData);

    const customerId =
      typeof order.customer === 'object' && order.customer !== null
        ? order.customer._id
        : (order.customer as string);

    const customerPayment =
      await this.orderRepository.calculateCustomerPayment(customerId);

    await this.customerRepository.update(customerId, {
      payment: customerPayment,
    });

    this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_DELIVERED, {
      orderId: id,
      updatedBy,
    });

    return updated;
  }
}
