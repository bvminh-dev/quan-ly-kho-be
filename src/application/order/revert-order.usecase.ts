import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderState } from '../../common/enums/index.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { RevertOrderDto } from './dto/revert-order.dto.js';

@Injectable()
export class RevertOrderUseCase {
  private readonly logger = new Logger(RevertOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
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

    const isPaymentNegative = order.payment < 0;
    const isPaymentEqualTotalPrice = -1 * order.payment === order.totalPrice;

    if (!isPaymentNegative || !isPaymentEqualTotalPrice) {
      throw new BadRequestException(
        'Chỉ có thể hoàn tác khi payment là số âm và |payment| = totalPrice (khách chưa trả tiền)',
      );
    }

    for (const product of order.products) {
      for (const item of product.items) {
        await this.warehouseRepository.updateStock(
          item.id,
          -item.quantity,
          item.quantity,
        );
      }
    }

    const updateData: Partial<{
      state: string;
      updatedBy: string;
      note?: string;
    }> = {
      state: OrderState.HOAN_TAC,
      updatedBy,
    };

    if (dto.note !== undefined) {
      updateData.note = dto.note;
    }

    const updated = await this.orderRepository.update(id, updateData as any);

    return updated;
  }
}
