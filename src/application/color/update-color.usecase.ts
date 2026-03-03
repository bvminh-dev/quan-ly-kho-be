import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IColorRepository } from '../../domain/color/color.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';
import { UpdateColorDto } from './dto/update-color.dto.js';

@Injectable()
export class UpdateColorUseCase {
  private readonly logger = new Logger(UpdateColorUseCase.name);

  constructor(
    @Inject('ColorRepository')
    private readonly colorRepository: IColorRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateColorDto, updatedBy: string) {
    this.logger.log(`Updating color ${id}`);

    const existing = await this.colorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Color với id ${id} không tồn tại`);
    }

    const updated = await this.colorRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Color với id ${id} không tồn tại`);
    }

    if (dto.name !== undefined && dto.name !== existing.name) {
      this.eventEmitter.emit(CATALOG_EVENTS.COLOR_UPDATED, {
        colorId: id,
        newName: dto.name,
      });
    }

    return updated;
  }
}
