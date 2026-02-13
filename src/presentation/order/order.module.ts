import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddHistoryUseCase } from '../../application/order/add-history.usecase.js';
import { ConfirmOrderUseCase } from '../../application/order/confirm-order.usecase.js';
import { CreateOrderUseCase } from '../../application/order/create-order.usecase.js';
import { DeleteOrderUseCase } from '../../application/order/delete-order.usecase.js';
import { GetOrderUseCase } from '../../application/order/get-order.usecase.js';
import { GetOrdersUseCase } from '../../application/order/get-orders.usecase.js';
import { RevertOrderUseCase } from '../../application/order/revert-order.usecase.js';
import { UpdateOrderUseCase } from '../../application/order/update-order.usecase.js';
import { OrderMongoRepository } from '../../infrastructure/mongo/order/order.mongo.repository.js';
import {
  Order,
  OrderSchema,
} from '../../infrastructure/mongo/order/order.schema.js';
import { CustomerModule } from '../customer/customer.module.js';
import { WarehouseModule } from '../warehouse/warehouse.module.js';
import { OrderController } from './order.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CustomerModule,
    WarehouseModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: OrderMongoRepository,
    },
    CreateOrderUseCase,
    GetOrdersUseCase,
    GetOrderUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    AddHistoryUseCase,
    ConfirmOrderUseCase,
    RevertOrderUseCase,
  ],
  exports: ['OrderRepository'],
})
export class OrderModule {}
