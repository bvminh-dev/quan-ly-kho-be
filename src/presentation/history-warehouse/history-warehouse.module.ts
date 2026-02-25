import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateHistoryEnterUseCase } from '../../application/history-warehouse/create-history-enter.usecase.js';
import { DeleteHistoryEnterUseCase } from '../../application/history-warehouse/delete-history-enter.usecase.js';
import { GetHistoryEnterUseCase } from '../../application/history-warehouse/get-history-enter.usecase.js';
import { GetHistoryEntersUseCase } from '../../application/history-warehouse/get-history-enters.usecase.js';
import { UpdateHistoryEnterUseCase } from '../../application/history-warehouse/update-history-enter.usecase.js';
import { CreateHistoryExportUseCase } from '../../application/history-warehouse/create-history-export.usecase.js';
import { DeleteHistoryExportUseCase } from '../../application/history-warehouse/delete-history-export.usecase.js';
import { GetHistoryExportUseCase } from '../../application/history-warehouse/get-history-export.usecase.js';
import { GetHistoryExportsUseCase } from '../../application/history-warehouse/get-history-exports.usecase.js';
import { UpdateHistoryExportUseCase } from '../../application/history-warehouse/update-history-export.usecase.js';
import { HistoryEnterMongoRepository } from '../../infrastructure/mongo/history-warehouse/history-enter.mongo.repository.js';
import {
  HistoryEnter,
  HistoryEnterSchema,
} from '../../infrastructure/mongo/history-warehouse/history-enter.schema.js';
import { HistoryExportMongoRepository } from '../../infrastructure/mongo/history-warehouse/history-export.mongo.repository.js';
import {
  HistoryExport,
  HistoryExportSchema,
} from '../../infrastructure/mongo/history-warehouse/history-export.schema.js';
import { HistoryWarehouseService } from '../../application/history-warehouse/history-warehouse.service.js';
import { HistoryExportEventListener } from '../../application/history-warehouse/history-export-event.listener.js';
import { HistoryWarehouseController } from './history-warehouse.controller.js';
import { OrderModule } from '../order/order.module.js';
import { WarehouseModule } from '../warehouse/warehouse.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistoryEnter.name, schema: HistoryEnterSchema },
      { name: HistoryExport.name, schema: HistoryExportSchema },
    ]),
    forwardRef(() => WarehouseModule),
    forwardRef(() => OrderModule),
  ],
  controllers: [HistoryWarehouseController],
  providers: [
    {
      provide: 'HistoryEnterRepository',
      useClass: HistoryEnterMongoRepository,
    },
    {
      provide: 'HistoryExportRepository',
      useClass: HistoryExportMongoRepository,
    },
    CreateHistoryEnterUseCase,
    GetHistoryEntersUseCase,
    GetHistoryEnterUseCase,
    UpdateHistoryEnterUseCase,
    DeleteHistoryEnterUseCase,
    CreateHistoryExportUseCase,
    GetHistoryExportsUseCase,
    GetHistoryExportUseCase,
    UpdateHistoryExportUseCase,
    DeleteHistoryExportUseCase,
    HistoryWarehouseService,
    HistoryExportEventListener,
  ],
  exports: [
    'HistoryEnterRepository',
    'HistoryExportRepository',
    HistoryWarehouseService,
    MongooseModule,
  ],
})
export class HistoryWarehouseModule {}
