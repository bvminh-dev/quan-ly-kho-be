import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcryptjs';
import type { IRoleRepository } from '../../domain/role/role.repository.js';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: CreateUserDto, createdBy: string) {
    this.logger.log(`Creating user with email ${dto.email}`);

    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        `Email ${dto.email} đã tồn tại trong hệ thống`,
      );
    }

    const role = await this.roleRepository.findById(dto.role);
    if (!role) {
      this.logger.warn(`Role ${dto.role} không tồn tại trong hệ thống`);
      throw new BadRequestException('Role không tồn tại trong hệ thống');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    const salt = genSaltSync(saltRounds);
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
