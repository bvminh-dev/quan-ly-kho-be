import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../../infrastructure/mongo/permission/permission.schema.js';
import { PermissionMongoRepository } from '../../infrastructure/mongo/permission/permission.mongo.repository.js';
import { CreatePermissionUseCase } from '../../application/permission/create-permission.usecase.js';
import { GetPermissionsUseCase } from '../../application/permission/get-permissions.usecase.js';
import { GetPermissionUseCase } from '../../application/permission/get-permission.usecase.js';
import { UpdatePermissionUseCase } from '../../application/permission/update-permission.usecase.js';
import { DeletePermissionUseCase } from '../../application/permission/delete-permission.usecase.js';
import { PermissionController } from './permission.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  controllers: [PermissionController],
  providers: [
    {
      provide: 'PermissionRepository',
      useClass: PermissionMongoRepository,
    },
    CreatePermissionUseCase,
    GetPermissionsUseCase,
    GetPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
  ],
  exports: [
    'PermissionRepository',
    MongooseModule,
  ],
})
export class PermissionModule {}
