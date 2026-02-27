import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';

@Injectable()
export class GetHistoryEntersUseCase {
  private readonly logger = new Logger(GetHistoryEntersUseCase.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log(`Fetching history enters with pagination`);
    return this.historyEnterRepository.findAll(
      queryString,
      currentPage,
      pageSize,
    );
  }
}
