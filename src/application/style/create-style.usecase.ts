import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IStyleRepository } from '../../domain/style/style.repository.js';
import { CreateStyleDto } from './dto/create-style.dto.js';

@Injectable()
export class CreateStyleUseCase {
  private readonly logger = new Logger(CreateStyleUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
  ) {}

  async execute(dto: CreateStyleDto, createdBy: string) {
    this.logger.log(`Creating style: ${dto.code}`);

    const existing = await this.styleRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(
        `Style với code "${dto.code}" đã tồn tại trong hệ thống`,
      );
    }

    return this.styleRepository.create({
      code: dto.code,
      name: dto.name,
      createdBy,
    });
  }
}
