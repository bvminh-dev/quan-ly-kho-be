import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IQualityRepository } from '../../domain/quality/quality.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';
import { UpdateQualityDto } from './dto/update-quality.dto.js';

@Injectable()
export class UpdateQualityUseCase {
  private readonly logger = new Logger(UpdateQualityUseCase.name);

  constructor(
    @Inject('QualityRepository')
    private readonly qualityRepository: IQualityRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateQualityDto, updatedBy: string) {
    this.logger.log(`Updating quality ${id}`);

    const existing = await this.qualityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quality với id ${id} không tồn tại`);
    }

    const updated = await this.qualityRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Quality với id ${id} không tồn tại`);
    }

    if (dto.name !== undefined && dto.name !== existing.name) {
      this.eventEmitter.emit(CATALOG_EVENTS.QUALITY_UPDATED, {
        qualityId: id,
        newName: dto.name,
      });
    }

    return updated;
  }
}
