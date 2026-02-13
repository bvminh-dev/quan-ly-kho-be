import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateWarehouseUseCase } from '../../application/warehouse/create-warehouse.usecase.js';
import { DeleteWarehouseUseCase } from '../../application/warehouse/delete-warehouse.usecase.js';
import { GetWarehouseUseCase } from '../../application/warehouse/get-warehouse.usecase.js';
import { GetWarehousesUseCase } from '../../application/warehouse/get-warehouses.usecase.js';
import { UpdateWarehouseUseCase } from '../../application/warehouse/update-warehouse.usecase.js';
import { WarehouseMongoRepository } from '../../infrastructure/mongo/warehouse/warehouse.mongo.repository.js';
import { Warehouse, WarehouseSchema } from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { WarehouseController } from './warehouse.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Warehouse.name, schema: WarehouseSchema }]),
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
  ],
  exports: ['WarehouseRepository', MongooseModule],
})
export class WarehouseModule {}
