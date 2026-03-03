import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';

@Injectable()
export class GetQualityUseCase {
  private readonly logger = new Logger(GetQualityUseCase.name);

  constructor(
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching quality ${id}`);

    const quality = await this.qualityRepository.findById(id);
    if (!quality) {
      throw new NotFoundException(`Quality với id ${id} không tồn tại`);
    }

    return quality;
  }
}
