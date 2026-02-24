import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IHistoryEnterRepository } from '../../domain/history-warehouse/history-enter.repository.js';

@Injectable()
export class DeleteHistoryEnterUseCase {
  private readonly logger = new Logger(DeleteHistoryEnterUseCase.name);

  constructor(
    @Inject('HistoryEnterRepository')
    private readonly historyEnterRepository: IHistoryEnterRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    this.logger.log(`Deleting history enter ${id}`);
    const history = await this.historyEnterRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`History enter với id ${id} không tồn tại`);
    }
    await this.historyEnterRepository.softDelete(id, deleteBy);
  }
}
