import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorMongoRepository } from '../../infrastructure/mongo/color/color.mongo.repository.js';
import {
  Color,
  ColorSchema,
} from '../../infrastructure/mongo/color/color.schema.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { CreateColorUseCase } from '../../application/color/create-color.usecase.js';
import { GetColorsUseCase } from '../../application/color/get-colors.usecase.js';
import { GetColorUseCase } from '../../application/color/get-color.usecase.js';
import { UpdateColorUseCase } from '../../application/color/update-color.usecase.js';
import { DeleteColorUseCase } from '../../application/color/delete-color.usecase.js';
import { ColorController } from './color.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Color.name, schema: ColorSchema },
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [ColorController],
  providers: [
    {
      provide: 'ColorRepository',
      useClass: ColorMongoRepository,
    },
    CreateColorUseCase,
    GetColorsUseCase,
    GetColorUseCase,
    UpdateColorUseCase,
    DeleteColorUseCase,
  ],
  exports: ['ColorRepository', MongooseModule],
})
export class ColorModule {}
