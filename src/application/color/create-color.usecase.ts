import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IColorRepository } from '../../domain/color/color.repository.js';
import { CreateColorDto } from './dto/create-color.dto.js';

@Injectable()
export class CreateColorUseCase {
  private readonly logger = new Logger(CreateColorUseCase.name);

  constructor(
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
  ) {}

  async execute(dto: CreateColorDto, createdBy: string) {
    this.logger.log(`Creating color: ${dto.code}`);

    const existing = await this.colorRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(
        `Color với code "${dto.code}" đã tồn tại trong hệ thống`,
      );
    }

    return this.colorRepository.create({
      code: dto.code,
      name: dto.name,
      createdBy,
    });
  }
}
