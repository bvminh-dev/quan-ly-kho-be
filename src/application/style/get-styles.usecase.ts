import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IStyleRepository } from '../../domain/style/style.repository.js';

@Injectable()
export class GetStylesUseCase {
  private readonly logger = new Logger(GetStylesUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log('Fetching list of styles');
    return this.styleRepository.findAll(queryString, currentPage, pageSize);
  }
}
