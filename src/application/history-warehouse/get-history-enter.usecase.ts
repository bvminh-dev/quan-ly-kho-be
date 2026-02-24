import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';

@Injectable()
export class GetHistoryEnterUseCase {
  private readonly logger = new Logger(GetHistoryEnterUseCase.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching history enter ${id}`);
    const history = await this.historyEnterRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`History enter với id ${id} không tồn tại`);
    }
    return history;
  }
}
