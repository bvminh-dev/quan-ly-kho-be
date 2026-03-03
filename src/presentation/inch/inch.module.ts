import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InchMongoRepository } from '../../infrastructure/mongo/inch/inch.mongo.repository.js';
import { Inch, InchSchema } from '../../infrastructure/mongo/inch/inch.schema.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { CreateInchUseCase } from '../../application/inch/create-inch.usecase.js';
import { GetInchsUseCase } from '../../application/inch/get-inchs.usecase.js';
import { GetInchUseCase } from '../../application/inch/get-inch.usecase.js';
import { UpdateInchUseCase } from '../../application/inch/update-inch.usecase.js';
import { DeleteInchUseCase } from '../../application/inch/delete-inch.usecase.js';
import { InchController } from './inch.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inch.name, schema: InchSchema },
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [InchController],
  providers: [
    {
      provide: 'InchRepository',
      useClass: InchMongoRepository,
    },
    CreateInchUseCase,
    GetInchsUseCase,
    GetInchUseCase,
    UpdateInchUseCase,
    DeleteInchUseCase,
  ],
  exports: ['InchRepository', MongooseModule],
})
export class InchModule {}
