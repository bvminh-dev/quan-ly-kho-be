import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IItemRepository } from '../../domain/item/item.repository.js';

@Injectable()
export class GetItemUseCase {
  private readonly logger = new Logger(GetItemUseCase.name);

  constructor(
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Fetching item ${id}`);

    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item với id ${id} không tồn tại`);
    }

    return item;
  }
}
