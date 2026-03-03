import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IStyleRepository } from '../../domain/style/style.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';
import { UpdateStyleDto } from './dto/update-style.dto.js';

@Injectable()
export class UpdateStyleUseCase {
  private readonly logger = new Logger(UpdateStyleUseCase.name);

  constructor(
    @Inject('StyleRepository')
    private readonly styleRepository: IStyleRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateStyleDto, updatedBy: string) {
    this.logger.log(`Updating style ${id}`);

    const existing = await this.styleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Style với id ${id} không tồn tại`);
    }

    const updated = await this.styleRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Style với id ${id} không tồn tại`);
    }

    if (dto.name !== undefined && dto.name !== existing.name) {
      this.eventEmitter.emit(CATALOG_EVENTS.STYLE_UPDATED, {
        styleId: id,
        newName: dto.name,
      });
    }

    return updated;
  }
}
