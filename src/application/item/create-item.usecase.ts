import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { IItemRepository } from '../../domain/item/item.repository.js';
import { CreateItemDto } from './dto/create-item.dto.js';

@Injectable()
export class CreateItemUseCase {
  private readonly logger = new Logger(CreateItemUseCase.name);

  constructor(
    @Inject('ItemRepository')
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(dto: CreateItemDto, createdBy: string) {
    this.logger.log(`Creating item: ${dto.code}`);

    const existing = await this.itemRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(
        `Item với code "${dto.code}" đã tồn tại trong hệ thống`,
      );
    }

    return this.itemRepository.create({
      code: dto.code,
      name: dto.name,
      createdBy,
    });
  }
}
