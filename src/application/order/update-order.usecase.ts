import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderState } from '../../common/enums/index.js';
import { HISTORY_WAREHOUSE_EVENTS } from '../../common/constants/events.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class UpdateOrderUseCase {
  private readonly logger = new Logger(UpdateOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateOrderDto, updatedBy: string) {
    this.logger.log(`Updating order ${id}`);

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if (existingOrder.state === (OrderState.HOAN_TAC as string)) {
      throw new BadRequestException('Không thể chỉnh sửa đơn hàng đã hoàn tác');
    }

    if (dto.products) {
      for (const product of existingOrder.products) {
        for (const item of product.items) {
          const quantitySet = product.quantitySet ?? 1;
          const occupiedQuantity = roundToTwo(quantitySet * item.quantity);

          await this.warehouseRepository.updateStock(
            item.id,
            -occupiedQuantity,
            occupiedQuantity,
          );
        }
      }

      let totalPriceBase = 0;
      for (const product of dto.products) {
        for (const item of product.items) {
          const warehouse = await this.warehouseRepository.findById(item.id);
          if (!warehouse) {
            throw new NotFoundException(
              `Warehouse với id ${item.id} không tồn tại`,
            );
          }
          const quantitySet = product.quantitySet ?? 1;
          const requiredQuantity = roundToTwo(quantitySet * item.quantity);

          if (warehouse.amountAvailable < requiredQuantity) {
            throw new BadRequestException(
              `Warehouse ${item.id} không đủ số lượng khả dụng. Hiện có: ${warehouse.amountAvailable}, yêu cầu: ${requiredQuantity}`,
            );
          }

          if (!product.isCalcSet) {
            totalPriceBase = roundToTwo(
              totalPriceBase + item.quantity * item.price - (item.sale ?? 0),
            );
          }
        }

        if (product.isCalcSet) {
          totalPriceBase = roundToTwo(
            totalPriceBase +
              (product.quantitySet ?? 1) * (product.priceSet ?? 0) -
              (product.saleSet ?? 0),
          );
        }
      }

      for (const product of dto.products) {
        for (const item of product.items) {
          const quantitySet = product.quantitySet ?? 1;
          const occupiedQuantity = roundToTwo(quantitySet * item.quantity);

          await this.warehouseRepository.updateStock(
            item.id,
            occupiedQuantity,
            -occupiedQuantity,
          );
        }
      }

      const exchangeRate =
        dto.exchangeRate !== undefined
          ? dto.exchangeRate
          : existingOrder.exchangeRate;

      const totalPrice = roundToTwo(totalPriceBase * exchangeRate);

      const totalPaid = roundToTwo(
        existingOrder.history
          .filter((h) => h.type === 'khách trả')
          .reduce((sum, h) => sum + h.moneyPaidNGN, 0),
      );
      const totalRefunded = roundToTwo(
        existingOrder.history
          .filter((h) => h.type === 'hoàn tiền')
          .reduce((sum, h) => sum + h.moneyPaidNGN, 0),
      );
      const newPayment = roundToTwo(totalPaid - totalRefunded - totalPrice);

      const debt = roundToTwo(dto.debt ?? existingOrder.debt);
      const paid = roundToTwo(dto.paid ?? existingOrder.paid);

      const newState =
        existingOrder.state === (OrderState.BAO_GIA as string)
          ? OrderState.BAO_GIA
          : OrderState.CHINH_SUA;

      const updated = await this.orderRepository.update(id, {
        ...dto,
        totalPrice,
        payment: newPayment,
        debt,
        paid,
        state: newState,
        products: dto.products.map((p) => ({
          nameSet: p.nameSet,
          priceSet: p.priceSet != null ? roundToTwo(p.priceSet) : undefined,
          quantitySet:
            p.quantitySet != null ? roundToTwo(p.quantitySet) : undefined,
          saleSet: p.saleSet != null ? roundToTwo(p.saleSet) : undefined,
          isCalcSet: p.isCalcSet ?? false,
          items: p.items.map((i) => ({
            id: i.id,
            quantity: roundToTwo(i.quantity),
            price: roundToTwo(i.price),
            sale: roundToTwo(i.sale ?? 0),
            customPrice: i.customPrice ?? false,
            customSale: i.customSale ?? false,
          })),
        })),
        updatedBy,
      } as any);

      if (updated && (updated.state as OrderState) !== OrderState.BAO_GIA) {
        const customerId =
          typeof updated.customer === 'object' && updated.customer !== null
            ? updated.customer._id
            : (updated.customer as string);

        const customerPayment =
          await this.orderRepository.calculateCustomerPayment(customerId);

        await this.customerRepository.update(customerId, {
          payment: customerPayment,
        });
      }

      this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_UPDATED, {
        orderId: id,
        updatedBy,
      });

      return updated;
    }

    const updated = await this.orderRepository.update(id, {
      ...dto,
      updatedBy,
    } as any);

    return updated;
  }
}
