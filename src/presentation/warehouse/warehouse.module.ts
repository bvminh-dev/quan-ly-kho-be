import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddStockUseCase } from '../../application/warehouse/add-stock.usecase.js';
import { CreateWarehouseUseCase } from '../../application/warehouse/create-warehouse.usecase.js';
import { DeleteWarehouseUseCase } from '../../application/warehouse/delete-warehouse.usecase.js';
import { GetWarehouseUseCase } from '../../application/warehouse/get-warehouse.usecase.js';
import { GetWarehousesUseCase } from '../../application/warehouse/get-warehouses.usecase.js';
import { UpdateWarehouseUseCase } from '../../application/warehouse/update-warehouse.usecase.js';
import { WarehouseCatalogListener } from '../../application/warehouse/warehouse-catalog.listener.js';
import { WarehouseMongoRepository } from '../../infrastructure/mongo/warehouse/warehouse.mongo.repository.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { HistoryWarehouseModule } from '../history-warehouse/history-warehouse.module.js';
import { InchModule } from '../inch/inch.module.js';
import { ItemModule } from '../item/item.module.js';
import { QualityModule } from '../quality/quality.module.js';
import { StyleModule } from '../style/style.module.js';
import { ColorModule } from '../color/color.module.js';
import { WarehouseController } from './warehouse.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
    forwardRef(() => HistoryWarehouseModule),
    InchModule,
    ItemModule,
    QualityModule,
    StyleModule,
    ColorModule,
  ],
  controllers: [WarehouseController],
  providers: [
    {
      provide: 'WarehouseRepository',
      useClass: WarehouseMongoRepository,
    },
    CreateWarehouseUseCase,
    GetWarehousesUseCase,
    GetWarehouseUseCase,
    UpdateWarehouseUseCase,
    DeleteWarehouseUseCase,
    AddStockUseCase,
    WarehouseCatalogListener,
  ],
  exports: ['WarehouseRepository', MongooseModule],
})
export class WarehouseModule {}
