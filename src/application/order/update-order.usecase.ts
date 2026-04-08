/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryType, OrderState } from '../../common/enums/index.js';
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
  ) { }

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
      // Kiểm tra xem đơn hàng đã có chiếm dụng hàng chưa (đã nhận tiền)
      const hasPaymentHistory = existingOrder.history.some(
        (h) => h.type === HistoryType.KHACH_TRA,
      );

      // Chỉ trả lại hàng cũ nếu đã có chiếm dụng
      if (hasPaymentHistory) {
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
            totalPriceBase =
              totalPriceBase +
              quantitySet * item.quantity * (item.price - (item.sale ?? 0));
          }
        }

        if (product.isCalcSet) {
          totalPriceBase =
            totalPriceBase +
            (product.quantitySet ?? 1) *
            ((product.priceSet ?? 0) - (product.saleSet ?? 0));
        }
      }

      // Chỉ chiếm dụng hàng mới nếu đã có chiếm dụng trước đó (đã nhận tiền)
      if (hasPaymentHistory) {
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
      }

      const totalUsd = roundToTwo(totalPriceBase);

      const newPaidedUsd = roundToTwo(
        existingOrder.history
          .filter((h) => h.type === HistoryType.KHACH_TRA)
          .reduce((sum, h) => sum + h.moneyPaidDolar, 0) -
        existingOrder.history
          .filter((h) => h.type === HistoryType.HOAN_TIEN)
          .reduce((sum, h) => sum + h.moneyPaidDolar, 0),
      );

      const debt = roundToTwo(dto.debt ?? existingOrder.debt);
      const paid = roundToTwo(dto.paid ?? existingOrder.paid);

      if (existingOrder.state === (OrderState.BAO_GIA as string)) {
        const customerId =
          typeof existingOrder.customer === 'object' &&
            existingOrder.customer !== null
            ? existingOrder.customer._id
            : (existingOrder.customer as string);
        const customer = await this.customerRepository.findById(customerId);
        if (customer) {
          const customerPayment = roundToTwo(customer.payment ?? 0);
          if (paid > customerPayment && paid > 0) {
            throw new BadRequestException(
              'Số tiền Paid vượt quá số dư của khách hàng, hãy kiểm tra lại Paid',
            );
          }
        }
      }

      const newState =
        existingOrder.state === (OrderState.BAO_GIA as string)
          ? OrderState.BAO_GIA
          : OrderState.CHINH_SUA;

      const updated = await this.orderRepository.update(id, {
        ...dto,
        totalUsd,
        paidedUsd: newPaidedUsd,
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
            unitOfCalculation: i.unitOfCalculation,
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

    if (existingOrder.state === (OrderState.BAO_GIA as string)) {
      const paid = roundToTwo(dto.paid ?? existingOrder.paid);
      const customerId =
        typeof existingOrder.customer === 'object' &&
          existingOrder.customer !== null
          ? existingOrder.customer._id
          : (existingOrder.customer as string);
      const customer = await this.customerRepository.findById(customerId);
      if (customer) {
        const customerPayment = roundToTwo(customer.payment ?? 0);
        if (paid > customerPayment && paid > 0) {
          throw new BadRequestException(
            'Số tiền Paid vượt quá số dư của khách hàng, hãy kiểm tra lại Paid',
          );
        }
      }
    }

    const updated = await this.orderRepository.update(id, {
      ...dto,
      updatedBy,
    } as any);

    return updated;
  }
}
