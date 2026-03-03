import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IItemRepository } from '../../domain/item/item.repository.js';
import { CATALOG_EVENTS } from '../../common/constants/events.js';
import { UpdateItemDto } from './dto/update-item.dto.js';

@Injectable()
export class UpdateItemUseCase {
  private readonly logger = new Logger(UpdateItemUseCase.name);

  constructor(
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: UpdateItemDto, updatedBy: string) {
    this.logger.log(`Updating item ${id}`);

    const existing = await this.itemRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Item với id ${id} không tồn tại`);
    }

    const updated = await this.itemRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`Item với id ${id} không tồn tại`);
    }

    if (dto.name !== undefined && dto.name !== existing.name) {
      this.eventEmitter.emit(CATALOG_EVENTS.ITEM_UPDATED, {
        itemId: id,
        newName: dto.name,
      });
    }

    return updated;
  }
}
