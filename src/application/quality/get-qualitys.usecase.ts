import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';

@Injectable()
export class GetQualitysUseCase {
  private readonly logger = new Logger(GetQualitysUseCase.name);

  constructor(
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log('Fetching list of qualitys');
    return this.qualityRepository.findAll(queryString, currentPage, pageSize);
  }
}
