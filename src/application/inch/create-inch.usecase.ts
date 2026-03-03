import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';
import { CreateInchDto } from './dto/create-inch.dto.js';

@Injectable()
export class CreateInchUseCase {
  private readonly logger = new Logger(CreateInchUseCase.name);

  constructor(
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
  ) {}

  async execute(dto: CreateInchDto, createdBy: string) {
    this.logger.log(`Creating inch: ${dto.code}`);

    const existing = await this.inchRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(
        `Inch với code "${dto.code}" đã tồn tại trong hệ thống`,
      );
    }

    return this.inchRepository.create({
      code: dto.code,
      name: dto.name,
      createdBy,
    });
  }
}
