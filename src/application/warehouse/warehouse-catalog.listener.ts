import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/warehouse/warehouse.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';

@Injectable()
export class WarehouseCatalogListener {
  private readonly logger = new Logger(WarehouseCatalogListener.name);

  constructor(
    @Inject('WarehouseRepository')
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  @OnEvent(CATALOG_EVENTS.INCH_UPDATED)
  async handleInchUpdated(payload: { inchId: string; newName: string }) {
    this.logger.log(
      `Syncing inch name to warehouses: inchId=${payload.inchId}, newName=${payload.newName}`,
    );
    const inchValue = parseFloat(payload.newName);
    await this.warehouseRepository.updateByCatalogId(
      'inchId',
      payload.inchId,
      'inches',
      isNaN(inchValue) ? 0 : inchValue,
    );
  }

  @OnEvent(CATALOG_EVENTS.ITEM_UPDATED)
  async handleItemUpdated(payload: { itemId: string; newName: string }) {
    this.logger.log(
      `Syncing item name to warehouses: itemId=${payload.itemId}, newName=${payload.newName}`,
    );
    await this.warehouseRepository.updateByCatalogId(
      'itemId',
      payload.itemId,
      'item',
      payload.newName,
    );
  }

  @OnEvent(CATALOG_EVENTS.QUALITY_UPDATED)
  async handleQualityUpdated(payload: { qualityId: string; newName: string }) {
    this.logger.log(
      `Syncing quality name to warehouses: qualityId=${payload.qualityId}, newName=${payload.newName}`,
    );
    await this.warehouseRepository.updateByCatalogId(
      'qualityId',
      payload.qualityId,
      'quality',
      payload.newName,
    );
  }

  @OnEvent(CATALOG_EVENTS.STYLE_UPDATED)
  async handleStyleUpdated(payload: { styleId: string; newName: string }) {
    this.logger.log(
      `Syncing style name to warehouses: styleId=${payload.styleId}, newName=${payload.newName}`,
    );
    await this.warehouseRepository.updateByCatalogId(
      'styleId',
      payload.styleId,
      'style',
      payload.newName,
    );
  }

  @OnEvent(CATALOG_EVENTS.COLOR_UPDATED)
  async handleColorUpdated(payload: { colorId: string; newName: string }) {
    this.logger.log(
      `Syncing color name to warehouses: colorId=${payload.colorId}, newName=${payload.newName}`,
    );
    await this.warehouseRepository.updateByCatalogId(
      'colorId',
      payload.colorId,
      'color',
      payload.newName,
    );
  }
}
