import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { ITokenProvider } from '../../domain/auth/token-provider.interface.js';

@Injectable()
export class JwtTokenProvider implements ITokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRE_TIME',
      ) as any,
    });
  }

  async createRefreshToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRE_TIME',
      ) as any,
    });
  }

  async verifyAccessToken(token: string): Promise<Record<string, any>> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async verifyRefreshToken(token: string): Promise<Record<string, any>> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
    });
  }
}
