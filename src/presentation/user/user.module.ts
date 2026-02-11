import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserUseCase } from '../../application/user/create-user.usecase.js';
import { DeleteUserUseCase } from '../../application/user/delete-user.usecase.js';
import { GetUserUseCase } from '../../application/user/get-user.usecase.js';
import { GetUsersUseCase } from '../../application/user/get-users.usecase.js';
import { ResetPasswordUseCase } from '../../application/user/reset-password.usecase.js';
import { UpdatePasswordUseCase } from '../../application/user/update-password.usecase.js';
import { UpdateUserUseCase } from '../../application/user/update-user.usecase.js';
import { UserMongoRepository } from '../../infrastructure/mongo/user/user.mongo.repository.js';
import {
  User,
  UserSchema,
} from '../../infrastructure/mongo/user/user.schema.js';
import { UserController } from './user.controller.js';
import { RoleModule } from '../role/role.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdatePasswordUseCase,
    ResetPasswordUseCase,
  ],
  exports: ['UserRepository', MongooseModule],
})
export class UserModule {}
