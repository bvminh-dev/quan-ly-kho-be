import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';
import { UpdateHistoryEnterDto } from './dto/update-history-enter.dto.js';

@Injectable()
export class UpdateHistoryEnterUseCase {
  private readonly logger = new Logger(UpdateHistoryEnterUseCase.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
  ) {}

  async execute(id: string, dto: UpdateHistoryEnterDto, updatedBy: string) {
    this.logger.log(`Updating history enter ${id}`);
    const updated = await this.historyEnterRepository.update(id, {
      ...dto,
      updatedBy,
    });
    if (!updated) {
      throw new NotFoundException(`History enter với id ${id} không tồn tại`);
    }
    return updated;
  }
}
