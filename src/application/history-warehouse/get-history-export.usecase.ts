import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';

@Injectable()
export class GetHistoryExportUseCase {
  private readonly logger = new Logger(GetHistoryExportUseCase.name);

  constructor(
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching history export ${id}`);
    const history = await this.historyExportRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`History export với id ${id} không tồn tại`);
    }
    return history;
  }
}
