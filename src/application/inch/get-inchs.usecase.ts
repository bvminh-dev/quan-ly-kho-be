import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';

@Injectable()
export class GetInchsUseCase {
  private readonly logger = new Logger(GetInchsUseCase.name);

  constructor(
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log('Fetching list of inchs');
    return this.inchRepository.findAll(queryString, currentPage, pageSize);
  }
}
