import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  HistoryEnterType,
  HistoryExportState,
} from '../../common/enums/index.js';
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
        totalAmount: warehouse.totalAmount,
        priceHigh: warehouse.priceHigh,
        priceLow: warehouse.priceLow,
        sale: warehouse.sale,
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
        quantity,
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
        quantityRevert,
        orderId,
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
        priceHighOld,
        priceHighNew,
        priceLowOld,
        priceLowNew,
        saleOld,
        saleNew,
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
      metadata: {},
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

    const orderItem = order.products
      .flatMap((p) => p.items)
      .find((item) => item.id === warehouseId);

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
      priceHigh: warehouse.priceHigh,
      priceLow: warehouse.priceLow,
      sale: warehouse.sale,
      orderId,
      type: order.type,
      priceOrder: orderItem.price,
      saleOrder: orderItem.sale,
      quantityOrder,
      stateOrder,
      paymentOrder,
      note: note || '',
      createdBy,
    });
  }
}
