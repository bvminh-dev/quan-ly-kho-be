import { Inject, Injectable, Logger } from '@nestjs/common';
import { canViewAllData } from '../../common/helpers/role-permission.helper.js';
import type { IStyleRepository } from '../../domain/style/style.repository.js';

@Injectable()
export class GetStylesUseCase {
  private readonly logger = new Logger(GetStylesUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
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
    this.logger.log('Fetching list of styles');
    const canViewAll = canViewAllData(
      roleName || '',
      isViewAllUser || false,
      viewAllUserApis || [],
      currentApiPath || '',
      currentMethod || '',
    );

    return this.styleRepository.findAll(
      queryString,
      currentPage,
      pageSize,
      userId,
      canViewAll,
    );
  }
}
