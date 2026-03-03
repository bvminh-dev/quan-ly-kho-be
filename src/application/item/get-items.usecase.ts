import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IItemRepository } from '../../domain/item/item.repository.js';

@Injectable()
export class GetItemsUseCase {
  private readonly logger = new Logger(GetItemsUseCase.name);

  constructor(
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    this.logger.log('Fetching list of items');
    return this.itemRepository.findAll(queryString, currentPage, pageSize);
  }
}
