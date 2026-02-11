import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../infrastructure/mongo/user/user.schema.js';
import { UserMongoRepository } from '../../infrastructure/mongo/user/user.mongo.repository.js';
import { CreateUserUseCase } from '../../application/user/create-user.usecase.js';
import { GetUsersUseCase } from '../../application/user/get-users.usecase.js';
import { GetUserUseCase } from '../../application/user/get-user.usecase.js';
import { UpdateUserUseCase } from '../../application/user/update-user.usecase.js';
import { DeleteUserUseCase } from '../../application/user/delete-user.usecase.js';
import { UpdatePasswordUseCase } from '../../application/user/update-password.usecase.js';
import { ResetPasswordUseCase } from '../../application/user/reset-password.usecase.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  exports: [
    'UserRepository',
    MongooseModule,
  ],
})
export class UserModule {}
