import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module.js';
import { RoleModule } from '../role/role.module.js';
import { AuthController } from './auth.controller.js';
import { LocalStrategy } from './passport/local.strategy.js';
import { JwtStrategy } from './passport/jwt.strategy.js';
import { ValidateUserUseCase } from '../../application/auth/validate-user.usecase.js';
import { SigninUseCase } from '../../application/auth/signin.usecase.js';
import { RefreshTokenUseCase } from '../../application/auth/refresh-token.usecase.js';
import { LogoutUseCase } from '../../application/auth/logout.usecase.js';
import { JwtTokenProvider } from '../../infrastructure/jwt/jwt-token.provider.js';

@Module({
    imports: [
        UserModule,
        RoleModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME') as any,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        JwtStrategy,
        ValidateUserUseCase,
        SigninUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        {
            provide: 'TokenProvider',
            useClass: JwtTokenProvider,
        },
    ],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
