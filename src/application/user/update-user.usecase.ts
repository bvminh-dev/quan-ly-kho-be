import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto, updatedBy: string) {
    const updated = await this.userRepository.update(id, {
      ...dto,
      updatedBy,
    });

    if (!updated) {
      throw new NotFoundException(`User với id ${id} không tồn tại`);
    }

    return updated;
  }
}
