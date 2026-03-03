import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemMongoRepository } from '../../infrastructure/mongo/item/item.mongo.repository.js';
import { Item, ItemSchema } from '../../infrastructure/mongo/item/item.schema.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { CreateItemUseCase } from '../../application/item/create-item.usecase.js';
import { GetItemsUseCase } from '../../application/item/get-items.usecase.js';
import { GetItemUseCase } from '../../application/item/get-item.usecase.js';
import { UpdateItemUseCase } from '../../application/item/update-item.usecase.js';
import { DeleteItemUseCase } from '../../application/item/delete-item.usecase.js';
import { ItemController } from './item.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [ItemController],
  providers: [
    {
      provide: 'ItemRepository',
      useClass: ItemMongoRepository,
    },
    CreateItemUseCase,
    GetItemsUseCase,
    GetItemUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
  ],
  exports: ['ItemRepository', MongooseModule],
})
export class ItemModule {}
