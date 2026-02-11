import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../../infrastructure/mongo/role/role.schema.js';
import { RoleMongoRepository } from '../../infrastructure/mongo/role/role.mongo.repository.js';
import { CreateRoleUseCase } from '../../application/role/create-role.usecase.js';
import { GetRolesUseCase } from '../../application/role/get-roles.usecase.js';
import { GetRoleUseCase } from '../../application/role/get-role.usecase.js';
import { UpdateRoleUseCase } from '../../application/role/update-role.usecase.js';
import { DeleteRoleUseCase } from '../../application/role/delete-role.usecase.js';
import { RoleController } from './role.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [
    {
      provide: 'RoleRepository',
      useClass: RoleMongoRepository,
    },
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
  ],
  exports: [
    'RoleRepository',
    MongooseModule,
  ],
})
export class RoleModule {}
