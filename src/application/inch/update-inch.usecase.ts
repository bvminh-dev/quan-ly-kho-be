import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IInchRepository } from '../../domain/inch/inch.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';
import { UpdateInchDto } from './dto/update-inch.dto.js';

@Injectable()
export class UpdateInchUseCase {
  private readonly logger = new Logger(UpdateInchUseCase.name);

  constructor(
    @Inject('InchRepository')
    private readonly inchRepository: IInchRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateInchDto, updatedBy: string) {
    this.logger.log(`Updating inch ${id}`);

    const existing = await this.inchRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Inch với id ${id} không tồn tại`);
    }

    const updated = await this.inchRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Inch với id ${id} không tồn tại`);
    }

    if (dto.name !== undefined && dto.name !== existing.name) {
      this.eventEmitter.emit(CATALOG_EVENTS.INCH_UPDATED, {
        inchId: id,
        newName: dto.name,
      });
    }

    return updated;
  }
}
