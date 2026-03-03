import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IColorRepository } from '../../domain/color/color.repository.js';

@Injectable()
export class GetColorsUseCase {
  private readonly logger = new Logger(GetColorsUseCase.name);

  constructor(
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log('Fetching list of colors');
    return this.colorRepository.findAll(queryString, currentPage, pageSize);
  }
}
