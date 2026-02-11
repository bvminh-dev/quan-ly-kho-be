import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

// --- User item ---
class UserItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109cb' })
  role: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109cc' })
  createdBy: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109cc' })
  updatedBy: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

// --- Create User ---
export class CreateUserResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new User' })
  message: string;

  @ApiProperty({ type: UserItemDto })
  data: UserItemDto;
}

// --- Get Users (paginate) ---
class UserListData {
  @ApiProperty({ type: [UserItemDto] })
  items: UserItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class GetUsersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list User with paginate' })
  message: string;

  @ApiProperty({ type: UserListData })
  data: UserListData;
}

// --- Get User by id ---
export class GetUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch User by id' })
  message: string;

  @ApiProperty({ type: UserItemDto })
  data: UserItemDto;
}

// --- Update User ---
export class UpdateUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a User' })
  message: string;

  @ApiProperty({ type: UserItemDto })
  data: UserItemDto;
}

// --- Delete User ---
export class DeleteUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a User' })
  message: string;

  @ApiProperty({ type: UserItemDto })
  data: UserItemDto;
}

// --- Update Password ---
export class UpdatePasswordResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update password' })
  message: string;

  @ApiProperty({ example: true })
  data: boolean;
}

// --- Reset Password ---
export class ResetPasswordResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Reset password by Admin' })
  message: string;

  @ApiProperty({ example: true })
  data: boolean;
}
