import { Inject, Injectable } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
import type { IUserRepository } from '../../domain/user/user.repository.js';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
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

    return this.userRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );
  }
}
