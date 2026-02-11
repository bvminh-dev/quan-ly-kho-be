import { ApiProperty } from '@nestjs/swagger';

// --- Signin ---
class SigninUserInfo {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({
    example: { _id: '60d0fe4f5311236168a109cb', name: 'admin' },
  })
  role: { _id: string; name: string };

  @ApiProperty({
    example: [
      {
        _id: '60d0fe4f5311236168a109cc',
        name: 'Create User',
        apiPath: '/api/v1/users',
        method: 'POST',
        module: 'users',
      },
    ],
  })
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

class SigninData {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: SigninUserInfo })
  user: SigninUserInfo;
}

export class SigninResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Signin User' })
  message: string;

  @ApiProperty({ type: SigninData })
  data: SigninData;
}

// --- Refresh Token ---
export class RefreshTokenResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Get User by refresh token' })
  message: string;

  @ApiProperty({ type: SigninData })
  data: SigninData;
}

// --- Logout ---
class LogoutData {
  @ApiProperty({ example: 'ok' })
  result: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Logout User' })
  message: string;

  @ApiProperty({ example: 'ok' })
  data: string;
}

// --- Account ---
class AccountData {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({
    example: { _id: '60d0fe4f5311236168a109cb', name: 'admin' },
  })
  role: { _id: string; name: string };

  @ApiProperty({
    example: [
      {
        _id: '60d0fe4f5311236168a109cc',
        name: 'Create User',
        apiPath: '/api/v1/users',
        method: 'POST',
        module: 'users',
      },
    ],
  })
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

export class AccountResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Get account info' })
  message: string;

  @ApiProperty({ type: AccountData })
  data: AccountData;
}
