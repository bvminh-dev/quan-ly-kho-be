/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import ms from 'ms';
import { SigninDto } from '../../application/auth/dto/signin.dto.js';
import { LogoutUseCase } from '../../application/auth/logout.usecase.js';
import { RefreshTokenUseCase } from '../../application/auth/refresh-token.usecase.js';
import { SigninUseCase } from '../../application/auth/signin.usecase.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  AccountResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  SigninResponseDto,
} from '../../common/swagger/auth-response.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signinUseCase: SigninUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiBody({ type: SigninDto })
  @ApiCreatedResponse({
    description: 'Đăng nhập thành công, trả về accessToken và thông tin user',
    type: SigninResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Email hoặc mật khẩu không đúng' })
  @ResponseMessage('Signin User')
  async signin(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.signinUseCase.execute(req.user);
    const refreshTokenExpireConfig = (this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_TIME',
    ) ?? '7d') as Parameters<typeof ms>[0];
    const refreshTokenCookieMaxAge = ms(refreshTokenExpireConfig);

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: refreshTokenCookieMaxAge,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Làm mới accessToken bằng refreshToken từ cookie' })
  @ApiOkResponse({
    description: 'Refresh token thành công, trả về accessToken mới',
    type: RefreshTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
  })
  @ResponseMessage('Get User by refresh token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.['refresh_token'];
    if (!refreshToken) {
      return { message: 'Không tìm thấy refresh token' };
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);
    const refreshTokenExpireConfig = (this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_TIME',
    ) ?? '7d') as Parameters<typeof ms>[0];
    const refreshTokenCookieMaxAge = ms(refreshTokenExpireConfig);

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: refreshTokenCookieMaxAge,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất, xóa refreshToken khỏi cookie và DB' })
  @ApiOkResponse({
    description: 'Đăng xuất thành công',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Logout User')
  async logout(
    @User() user: ICurrentUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.logoutUseCase.execute(user._id);

    response.clearCookie('refresh_token');

    return 'ok';
  }

  @Get('account')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  @ApiOkResponse({
    description: 'Trả về thông tin tài khoản hiện tại',
    type: AccountResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Get account info')
  async getAccount(@User() user: ICurrentUser) {
    return user;
  }
}
