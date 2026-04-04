import { Inject, Injectable } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
import type { ICustomerRepository } from '../../domain/customer/customer.repository.js';

@Injectable()
export class GetCustomersUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(
    queryString: string,
    currentPage: number,
    pageSize: number,
    userId?: string,
    roleName?: string,
    isViewAllUser?: boolean,
    viewAllUserApis?: Array<{ _id: string; apiPath: string; method: string }>,
    currentApiPath?: string,
    currentMethod?: string,
  ) {
    const canViewAll = canViewAllData(
      roleName || '',
      isViewAllUser || false,
      viewAllUserApis || [],
      currentApiPath || '',
      currentMethod || '',
    );

    return this.customerRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );
  }
}
