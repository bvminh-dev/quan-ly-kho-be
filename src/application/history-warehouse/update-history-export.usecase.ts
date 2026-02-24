import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';
import { UpdateHistoryExportDto } from './dto/update-history-export.dto.js';

@Injectable()
export class UpdateHistoryExportUseCase {
  private readonly logger = new Logger(UpdateHistoryExportUseCase.name);

  constructor(
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
  ) {}

  async execute(id: string, dto: UpdateHistoryExportDto, updatedBy: string) {
    this.logger.log(`Updating history export ${id}`);
    const updated = await this.historyExportRepository.update(id, {
      ...dto,
      updatedBy,
    });
    if (!updated) {
      throw new NotFoundException(`History export với id ${id} không tồn tại`);
    }
    return updated;
  }
}
