import { Inject, Injectable } from '@nestjs/common';
import type { ITokenProvider } from '../../domain/auth/token-provider.interface.js';
import type { IRoleRepository } from '../../domain/role/role.repository.js';
import type { IUserRepository } from '../../domain/user/user.repository.js';

@Injectable()
export class SigninUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('TokenProvider')
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(user: {
    _id: string;
    name: string;
    email: string;
    role: string | null;
  }) {
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.tokenProvider.createAccessToken(payload);
    const refreshToken = await this.tokenProvider.createRefreshToken(payload);

    // Save refresh token to DB
    await this.userRepository.updateRefreshToken(user._id, refreshToken);

    // Get role with permissions
    const role = user.role
      ? await this.roleRepository.findByIdWithPopulate(user.role)
      : null;

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role ? { _id: role._id, name: role.name } : null,
        permissions: role ? role.permissions : [],
      },
    };
  }
}
