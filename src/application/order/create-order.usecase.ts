/* eslint-disable prettier/prettier */
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
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(dto: CreateOrderDto, createdBy: string) {
    this.logger.log(`Creating order for customer ${dto.customer}`);

    const customer = await this.customerRepository.findById(dto.customer);
    if (!customer) {
      throw new NotFoundException(
        `Customer với id ${dto.customer} không tồn tại`,
      );
    }

    let totalPrice = 0;

    for (const product of dto.products) {
      if (!product.items || product.items.length === 0) {
        throw new BadRequestException('Mỗi product phải có ít nhất 1 item');
      }

      for (const item of product.items) {
        const warehouse = await this.warehouseRepository.findById(item.id);
        if (!warehouse) {
          throw new NotFoundException(
            `Warehouse với id ${item.id} không tồn tại`,
          );
        }

        const quantitySet = product.quantitySet ?? 1;
        const requiredQuantity = quantitySet * item.quantity;

        if (warehouse.amountAvailable < requiredQuantity) {
          const productName = `${warehouse.inches}" ${warehouse.item} ${warehouse.quality} ${warehouse.style} ${warehouse.color}`;
          throw new BadRequestException(
            `Hàng ${productName} không đủ trong kho`,
          );
        }

        if (!product.isCalcSet) {
          totalPrice =
            totalPrice +
            quantitySet * item.quantity * (item.price - (item.sale ?? 0));
        }
      }

      if (product.isCalcSet) {
        totalPrice =
          totalPrice +
          (product.quantitySet ?? 1) *
          ((product.priceSet ?? 0) - (product.saleSet ?? 0));
      }
    }

    const totalUsd = roundToTwo(totalPrice);
    const debt = roundToTwo(dto.debt ?? 0);
    const paid = roundToTwo(dto.paid ?? 0);

    const customerPayment = roundToTwo(customer.payment ?? 0);
    if (paid > customerPayment && paid > 0) {
      throw new BadRequestException(
        'Số tiền Paid vượt quá số dư của khách hàng, hãy kiểm tra lại Paid',
      );
    }

    const order = await this.orderRepository.create({
      type: dto.type,
      state: OrderState.BAO_GIA,
      exchangeRate: roundToTwo(dto.exchangeRate),
      customer: dto.customer,
      totalUsd,
      paidedUsd: 0,
      debt,
      paid,
      note: dto.note ?? '',
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
      history: [],
      createdBy,
    });

    // Khi ở trạng thái "Báo giá", hàng trong kho không được trừ và không chiếm dụng
    // Hàng chỉ chiếm dụng khi nhận được tiền thanh toán

    this.eventEmitter.emit(HISTORY_WAREHOUSE_EVENTS.ORDER_CREATED, {
      orderId: order._id,
      createdBy,
    });

    return order;
  }
}
