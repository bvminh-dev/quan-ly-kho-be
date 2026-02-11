import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<string> {
    await this.userRepository.updateRefreshToken(userId, null);
    return 'ok';
  }
}
