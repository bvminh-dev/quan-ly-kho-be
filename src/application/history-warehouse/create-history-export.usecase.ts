import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IHistoryExportRepository } from '../../domain/history-warehouse/history-export.repository.js';
import { CreateHistoryExportDto } from './dto/create-history-export.dto.js';

@Injectable()
export class CreateHistoryExportUseCase {
  private readonly logger = new Logger(CreateHistoryExportUseCase.name);

  constructor(
    @Inject('HistoryExportRepository')
    private readonly historyExportRepository: IHistoryExportRepository,
  ) {}

  async execute(dto: CreateHistoryExportDto, createdBy: string) {
    this.logger.log(`Creating history export for warehouse ${dto.warehouseId}`);
    const history = await this.historyExportRepository.create({
      ...dto,
      createdBy,
    });
    return history;
  }
}
