import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcryptjs';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: CreateUserDto, createdBy: string) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        `Email ${dto.email} đã tồn tại trong hệ thống`,
      );
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(dto.password, salt);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      isActive: dto.isActive ?? true,
      createdBy,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
