import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateCustomerUseCase } from '../../application/customer/create-customer.usecase.js';
import { DeleteCustomerUseCase } from '../../application/customer/delete-customer.usecase.js';
import { GetCustomerUseCase } from '../../application/customer/get-customer.usecase.js';
import { GetCustomersUseCase } from '../../application/customer/get-customers.usecase.js';
import { UpdateCustomerUseCase } from '../../application/customer/update-customer.usecase.js';
import { CustomerMongoRepository } from '../../infrastructure/mongo/customer/customer.mongo.repository.js';
import { Customer, CustomerSchema } from '../../infrastructure/mongo/customer/customer.schema.js';
import { CustomerController } from './customer.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CustomerRepository',
      useClass: CustomerMongoRepository,
    },
    CreateCustomerUseCase,
    GetCustomersUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: ['CustomerRepository', MongooseModule],
})
export class CustomerModule {}
