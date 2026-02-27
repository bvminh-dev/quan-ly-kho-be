import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';

@Injectable()
export class GetHistoryExportsUseCase {
  private readonly logger = new Logger(GetHistoryExportsUseCase.name);

  constructor(
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log(`Fetching history exports with pagination`);
    return this.historyExportRepository.findAll(
      queryString,
      currentPage,
      pageSize,
    );
  }
}
