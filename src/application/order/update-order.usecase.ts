import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderState } from '../../common/enums/index.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class UpdateOrderUseCase {
  private readonly logger = new Logger(UpdateOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(id: string, dto: UpdateOrderDto, updatedBy: string) {
    this.logger.log(`Updating order ${id}`);

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order với id ${id} không tồn tại`);
    }

    if (existingOrder.state === OrderState.HOAN_TAC) {
      throw new BadRequestException('Không thể chỉnh sửa đơn hàng đã hoàn tác');
    }

    if (dto.products) {
      for (const product of existingOrder.products) {
        for (const item of product.items) {
          await this.warehouseRepository.updateStock(item.id, -item.quantity, item.quantity);
        }
      }

      let totalPrice = 0;
      for (const product of dto.products) {
        for (const item of product.items) {
          const warehouse = await this.warehouseRepository.findById(item.id);
          if (!warehouse) {
            throw new NotFoundException(`Warehouse với id ${item.id} không tồn tại`);
          }
          if (warehouse.amountAvailable < item.quantity) {
            throw new BadRequestException(
              `Warehouse ${item.id} không đủ số lượng khả dụng. Hiện có: ${warehouse.amountAvailable}, yêu cầu: ${item.quantity}`,
            );
          }

          if (product.isCalcSet) {
            // skip
          } else {
            totalPrice += item.quantity * item.price - (item.sale ?? 0);
          }
        }

        if (product.isCalcSet) {
          totalPrice += (product.quantitySet ?? 1) * (product.priceSet ?? 0) - (product.saleSet ?? 0);
        }
      }

      for (const product of dto.products) {
        for (const item of product.items) {
          await this.warehouseRepository.updateStock(item.id, item.quantity, -item.quantity);
        }
      }

      const totalPaid = existingOrder.history
        .filter((h) => h.type === 'khách trả')
        .reduce((sum, h) => sum + h.moneyPaidNGN, 0);
      const totalRefunded = existingOrder.history
        .filter((h) => h.type === 'hoàn tiền')
        .reduce((sum, h) => sum + h.moneyPaidNGN, 0);
      const newPayment = totalPaid - totalRefunded - totalPrice;

      const updated = await this.orderRepository.update(id, {
        ...dto,
        totalPrice,
        payment: newPayment,
        state: OrderState.CHINH_SUA,
        products: dto.products.map((p) => ({
          nameSet: p.nameSet,
          priceSet: p.priceSet,
          quantitySet: p.quantitySet,
          saleSet: p.saleSet,
          isCalcSet: p.isCalcSet ?? false,
          items: p.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
            sale: i.sale ?? 0,
            customPrice: i.customPrice ?? false,
            customSale: i.customSale ?? false,
          })),
        })),
        updatedBy,
      } as any);

      return updated;
    }

    const updated = await this.orderRepository.update(id, {
      ...dto,
      updatedBy,
    } as any);

    return updated;
  }
}
