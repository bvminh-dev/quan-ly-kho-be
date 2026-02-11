import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IRoleRepository } from '../../../domain/role/role.repository.js';
import type { IUserRepository } from '../../../domain/user/user.repository.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_KEY') || 'default-secret',
    });
  }

  async validate(payload: { sub: string; name: string; email: string }) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) return null;

    // Get role with populated permissions
    const roleId =
      typeof user.role === 'object' ? user.role?._id : user.role;
    const role = roleId
      ? await this.roleRepository.findByIdWithPopulate(roleId)
      : null;

    return {
      _id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: role ? { _id: role._id, name: role.name } : null,
      permissions: role ? role.permissions : [],
    };
  }
}
