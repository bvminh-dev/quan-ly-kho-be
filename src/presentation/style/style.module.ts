import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StyleMongoRepository } from '../../infrastructure/mongo/style/style.mongo.repository.js';
import {
  Style,
  StyleSchema,
} from '../../infrastructure/mongo/style/style.schema.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { CreateStyleUseCase } from '../../application/style/create-style.usecase.js';
import { GetStylesUseCase } from '../../application/style/get-styles.usecase.js';
import { GetStyleUseCase } from '../../application/style/get-style.usecase.js';
import { UpdateStyleUseCase } from '../../application/style/update-style.usecase.js';
import { DeleteStyleUseCase } from '../../application/style/delete-style.usecase.js';
import { StyleController } from './style.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Style.name, schema: StyleSchema },
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [StyleController],
  providers: [
    {
      provide: 'StyleRepository',
      useClass: StyleMongoRepository,
    },
    CreateStyleUseCase,
    GetStylesUseCase,
    GetStyleUseCase,
    UpdateStyleUseCase,
    DeleteStyleUseCase,
  ],
  exports: ['StyleRepository', MongooseModule],
})
export class StyleModule {}
