import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IStyleRepository } from '../../domain/style/style.repository.js';

@Injectable()
export class GetStyleUseCase {
  private readonly logger = new Logger(GetStyleUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching style ${id}`);

    const style = await this.styleRepository.findById(id);
    if (!style) {
      throw new NotFoundException(`Style với id ${id} không tồn tại`);
    }

    return style;
  }
}
