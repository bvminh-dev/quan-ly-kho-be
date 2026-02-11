import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

// --- Permission item ---
class PermissionItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'Create User' })
  name: string;

  @ApiProperty({ example: '/api/v1/users' })
  apiPath: string;

  @ApiProperty({ example: 'POST' })
  method: string;

  @ApiProperty({ example: 'users' })
  module: string;

  @ApiProperty({ example: 'Permission to create a user' })
  description: string;

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

// --- Create Permission ---
export class CreatePermissionResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new Permission' })
  message: string;

  @ApiProperty({ type: PermissionItemDto })
  data: PermissionItemDto;
}

// --- Get Permissions (paginate) ---
class PermissionListData {
  @ApiProperty({ type: [PermissionItemDto] })
  items: PermissionItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class GetPermissionsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list Permission with paginate' })
  message: string;

  @ApiProperty({ type: PermissionListData })
  data: PermissionListData;
}

// --- Get Permission by id ---
export class GetPermissionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch Permission by id' })
  message: string;

  @ApiProperty({ type: PermissionItemDto })
  data: PermissionItemDto;
}

// --- Update Permission ---
export class UpdatePermissionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a Permission' })
  message: string;

  @ApiProperty({ type: PermissionItemDto })
  data: PermissionItemDto;
}

// --- Delete Permission ---
export class DeletePermissionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a Permission' })
  message: string;

  @ApiProperty({ type: PermissionItemDto })
  data: PermissionItemDto;
}
