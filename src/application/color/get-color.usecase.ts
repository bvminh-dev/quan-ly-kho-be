import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IColorRepository } from '../../domain/color/color.repository.js';

@Injectable()
export class GetColorUseCase {
  private readonly logger = new Logger(GetColorUseCase.name);

  constructor(
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching color ${id}`);

    const color = await this.colorRepository.findById(id);
    if (!color) {
      throw new NotFoundException(`Color với id ${id} không tồn tại`);
    }

    return color;
  }
}
