import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, deleteBy: string): Promise<void> {
    await this.userRepository.softDelete(id, deleteBy);
  }
}
