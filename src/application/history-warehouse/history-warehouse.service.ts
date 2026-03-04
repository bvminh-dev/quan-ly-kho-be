import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  HistoryEnterType,
  HistoryExportState,
} from '../../common/enums/index.js';
import { roundToTwo } from '../../common/utils/number.util.js';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';
import type { IOrderRepository } from '../../domain/order/order.repository.js';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';

@Injectable()
export class HistoryWarehouseService {
  private readonly logger = new Logger(HistoryWarehouseService.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createHistoryEnterForCreateWarehouse(
    warehouseId: string,
    createdBy: string,
  ) {
    this.logger.log(`Creating history enter for new warehouse ${warehouseId}`);
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    await this.historyEnterRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      type: HistoryEnterType.TAO_MOI,
      metadata: {
        totalAmount: roundToTwo(warehouse.totalAmount),
        priceHigh: roundToTwo(warehouse.priceHigh),
        priceLow: roundToTwo(warehouse.priceLow),
        sale: roundToTwo(warehouse.sale),
        unitOfCalculation: warehouse.unitOfCalculation,
      },
      note: 'Khởi tạo',
      createdBy,
    });
  }

  async createHistoryEnterForAddStock(
    warehouseId: string,
    quantity: number,
    note: string,
    createdBy: string,
  ) {
    this.logger.log(
      `Creating history enter for add stock to warehouse ${warehouseId}`,
    );
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    await this.historyEnterRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      type: HistoryEnterType.NHAP_THEM_HANG,
      metadata: {
        quantity: roundToTwo(quantity),
        unitOfCalculation: warehouse.unitOfCalculation,
      },
      note: note || '',
      createdBy,
    });
  }

  async createHistoryEnterForRevertOrder(
    warehouseId: string,
    orderId: string,
    quantityRevert: number,
    note: string,
    createdBy: string,
  ) {
    this.logger.log(
      `Creating history enter for revert order ${orderId} in warehouse ${warehouseId}`,
    );
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    await this.historyEnterRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      type: HistoryEnterType.HOAN_DON,
      metadata: {
        quantityRevert: roundToTwo(quantityRevert),
        orderId,
        unitOfCalculation: warehouse.unitOfCalculation,
      },
      note: note || '',
      createdBy,
    });
  }

  async createHistoryEnterForUpdatePrice(
    warehouseId: string,
    priceHighOld: number,
    priceHighNew: number,
    priceLowOld: number,
    priceLowNew: number,
    saleOld: number,
    saleNew: number,
    createdBy: string,
  ) {
    this.logger.log(
      `Creating history enter for update price in warehouse ${warehouseId}`,
    );
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    const note = `Sửa giá`;

    await this.historyEnterRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      type: HistoryEnterType.SUA_GIA,
      metadata: {
        priceHighOld: roundToTwo(priceHighOld),
        priceHighNew: roundToTwo(priceHighNew),
        priceLowOld: roundToTwo(priceLowOld),
        priceLowNew: roundToTwo(priceLowNew),
        saleOld: roundToTwo(saleOld),
        saleNew: roundToTwo(saleNew),
        unitOfCalculation: warehouse.unitOfCalculation,
      },
      note,
      createdBy,
    });
  }

  async createHistoryEnterForDelete(warehouseId: string, createdBy: string) {
    this.logger.log(
      `Creating history enter for delete warehouse ${warehouseId}`,
    );
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    await this.historyEnterRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      type: HistoryEnterType.XOA,
      metadata: {
        totalAmount: roundToTwo(warehouse.totalAmount),
        amountOccupied: roundToTwo(warehouse.amountOccupied),
        amountAvailable: roundToTwo(warehouse.amountAvailable),
        unitOfCalculation: warehouse.unitOfCalculation,
      },
      note: 'Xóa nguyên liệu',
      createdBy,
    });
  }

  async createHistoryExportForOrder(
    warehouseId: string,
    orderId: string,
    quantityOrder: number,
    stateOrder: HistoryExportState,
    paymentOrder: number,
    note: string,
    createdBy: string,
  ) {
    this.logger.log(
      `Creating history export for order ${orderId} in warehouse ${warehouseId}`,
    );
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      this.logger.warn(`Warehouse ${warehouseId} not found`);
      return;
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(`Order ${orderId} not found`);
      return;
    }

    const warehouseIdStr = String(warehouseId);
    const orderItem = order.products
      .flatMap((p) => p.items)
      .find((item) => String(item.id) === warehouseIdStr);

    if (!orderItem) {
      this.logger.warn(
        `Order item not found for warehouse ${warehouseId} in order ${orderId}`,
      );
      return;
    }

    await this.historyExportRepository.create({
      warehouseId,
      item: warehouse.item,
      inches: warehouse.inches,
      quality: warehouse.quality,
      style: warehouse.style,
      color: warehouse.color,
      priceHigh: roundToTwo(warehouse.priceHigh),
      priceLow: roundToTwo(warehouse.priceLow),
      sale: roundToTwo(warehouse.sale),
      unitOfCalculation: warehouse.unitOfCalculation,
      orderId,
      type: order.type,
      priceOrder: roundToTwo(orderItem.price),
      saleOrder: roundToTwo(orderItem.sale),
      quantityOrder: roundToTwo(quantityOrder),
      stateOrder,
      paymentOrder: roundToTwo(paymentOrder),
      note: note || '',
      createdBy,
    });
  }

  async createHistoryExportForOrderCreated(
    orderId: string,
    createdBy: string,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(`Order ${orderId} not found for history-export created`);
      return;
    }
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const quantityOrder = roundToTwo(quantitySet * item.quantity);

        await this.createHistoryExportForOrder(
          String(item.id),
          orderId,
          quantityOrder,
          HistoryExportState.BAO_GIA,
          0,
          '',
          createdBy,
        );
      }
    }
  }

  async createHistoryExportForOrderConfirmed(
    orderId: string,
    updatedBy: string,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(
        `Order ${orderId} not found for history-export confirmed`,
      );
      return;
    }
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const quantityOrder = roundToTwo(quantitySet * item.quantity);

        await this.createHistoryExportForOrder(
          String(item.id),
          orderId,
          quantityOrder,
          HistoryExportState.DA_CHOT,
          0,
          '',
          updatedBy,
        );
      }
    }
  }

  async createHistoryExportForOrderUpdated(
    orderId: string,
    updatedBy: string,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(`Order ${orderId} not found for history-export updated`);
      return;
    }
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const quantityOrder = roundToTwo(quantitySet * item.quantity);

        await this.createHistoryExportForOrder(
          String(item.id),
          orderId,
          quantityOrder,
          HistoryExportState.CHINH_SUA,
          0,
          '',
          updatedBy,
        );
      }
    }
  }

  async createHistoryExportForOrderPayment(
    orderId: string,
    stateOrder: HistoryExportState,
    paymentOrder: number,
    note: string,
    createdBy: string,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(`Order ${orderId} not found for history-export payment`);
      return;
    }
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const quantityOrder = roundToTwo(quantitySet * item.quantity);

        await this.createHistoryExportForOrder(
          String(item.id),
          orderId,
          quantityOrder,
          stateOrder,
          paymentOrder,
          note,
          createdBy,
        );
      }
    }
  }

  async createHistoryExportForOrderCompleted(
    orderId: string,
    createdBy: string,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn(
        `Order ${orderId} not found for history-export completed`,
      );
      return;
    }
    for (const product of order.products) {
      for (const item of product.items) {
        const quantitySet = product.quantitySet ?? 1;
        const quantityOrder = roundToTwo(quantitySet * item.quantity);

        await this.createHistoryExportForOrder(
          String(item.id),
          orderId,
          quantityOrder,
          HistoryExportState.DA_XONG,
          0,
          '',
          createdBy,
        );
      }
    }
  }
}
