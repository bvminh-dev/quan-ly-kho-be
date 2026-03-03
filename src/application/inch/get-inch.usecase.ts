import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';

@Injectable()
export class GetInchUseCase {
  private readonly logger = new Logger(GetInchUseCase.name);

  constructor(
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching inch ${id}`);

    const inch = await this.inchRepository.findById(id);
    if (!inch) {
      throw new NotFoundException(`Inch với id ${id} không tồn tại`);
    }

    return inch;
  }
}
