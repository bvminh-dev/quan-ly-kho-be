import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: ResetPasswordDto, updatedBy: string) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User với id ${dto.userId} không tồn tại`);
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(dto.newPassword, salt);

    await this.userRepository.update(dto.userId, {
      password: hashedPassword,
      updatedBy,
    });

    return { message: 'Reset mật khẩu thành công' };
  }
}
