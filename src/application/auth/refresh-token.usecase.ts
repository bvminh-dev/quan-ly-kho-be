import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.js';
import type { IRoleRepository } from '../../domain/role/role.repository.js';
import type { ITokenProvider } from '../../domain/auth/token-provider.interface.js';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('TokenProvider')
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(refreshToken: string) {
    // Verify refresh token
    let decoded: Record<string, any>;
    try {
      decoded = await this.tokenProvider.verifyRefreshToken(refreshToken);
    } catch {
      throw new BadRequestException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    // Find user by refresh token
    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new BadRequestException('Refresh token không tồn tại trong hệ thống');
    }

    // Generate new tokens
    const payload = { sub: user._id, name: user.name, email: user.email };
    const newAccessToken = await this.tokenProvider.createAccessToken(payload);
    const newRefreshToken = await this.tokenProvider.createRefreshToken(payload);

    // Update refresh token in DB
    await this.userRepository.updateRefreshToken(user._id, newRefreshToken);

    // Get role with permissions
    const roleId =
      typeof user.role === 'object' ? user.role?._id : user.role;
    const role = roleId
      ? await this.roleRepository.findByIdWithPopulate(roleId)
      : null;

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
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
