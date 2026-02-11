import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    const isMatch = compareSync(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(dto.newPassword, salt);

    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Cập nhật mật khẩu thành công' };
  }
}
