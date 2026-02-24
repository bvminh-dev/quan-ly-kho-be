import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';
import { CreateHistoryEnterDto } from './dto/create-history-enter.dto.js';

@Injectable()
export class CreateHistoryEnterUseCase {
  private readonly logger = new Logger(CreateHistoryEnterUseCase.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
  ) {}

  async execute(dto: CreateHistoryEnterDto, createdBy: string) {
    this.logger.log(`Creating history enter for warehouse ${dto.warehouseId}`);
    const history = await this.historyEnterRepository.create({
      ...dto,
      createdBy,
    });
    return history;
  }
}
