import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(queryString: string, currentPage: number, pageSize: number) {
    return this.userRepository.findAll(queryString, currentPage, pageSize);
  }
}
