import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QualityMongoRepository } from '../../infrastructure/mongo/quality/quality.mongo.repository.js';
import {
  Quality,
  QualitySchema,
} from '../../infrastructure/mongo/quality/quality.schema.js';
import {
  Warehouse,
  WarehouseSchema,
} from '../../infrastructure/mongo/warehouse/warehouse.schema.js';
import { CreateQualityUseCase } from '../../application/quality/create-quality.usecase.js';
import { GetQualitysUseCase } from '../../application/quality/get-qualitys.usecase.js';
import { GetQualityUseCase } from '../../application/quality/get-quality.usecase.js';
import { UpdateQualityUseCase } from '../../application/quality/update-quality.usecase.js';
import { DeleteQualityUseCase } from '../../application/quality/delete-quality.usecase.js';
import { QualityController } from './quality.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quality.name, schema: QualitySchema },
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [QualityController],
  providers: [
    {
      provide: 'QualityRepository',
      useClass: QualityMongoRepository,
    },
    CreateQualityUseCase,
    GetQualitysUseCase,
    GetQualityUseCase,
    UpdateQualityUseCase,
    DeleteQualityUseCase,
  ],
  exports: ['QualityRepository', MongooseModule],
})
export class QualityModule {}
