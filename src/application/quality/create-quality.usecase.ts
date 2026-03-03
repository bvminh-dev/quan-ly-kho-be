import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';
import { CreateQualityDto } from './dto/create-quality.dto.js';

@Injectable()
export class CreateQualityUseCase {
  private readonly logger = new Logger(CreateQualityUseCase.name);

  constructor(
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
  ) {}

  async execute(dto: CreateQualityDto, createdBy: string) {
    this.logger.log(`Creating quality: ${dto.code}`);

    const existing = await this.qualityRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(
        `Quality với code "${dto.code}" đã tồn tại trong hệ thống`,
      );
    }

    return this.qualityRepository.create({
      code: dto.code,
      name: dto.name,
      createdBy,
    });
  }
}
