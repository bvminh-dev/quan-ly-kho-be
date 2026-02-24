import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';

@Injectable()
export class DeleteHistoryExportUseCase {
  private readonly logger = new Logger(DeleteHistoryExportUseCase.name);

  constructor(
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting history export ${id}`);
    const history = await this.historyExportRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`History export với id ${id} không tồn tại`);
    }
    await this.historyExportRepository.softDelete(id, deleteBy);
  }
}
