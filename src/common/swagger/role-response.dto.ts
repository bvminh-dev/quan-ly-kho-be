import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

// --- Role item ---
class RoleItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'moderator' })
  name: string;

  @ApiProperty({ example: 'Moderator role' })
  description: string;

  @ApiProperty({ example: ['60d0fe4f5311236168a109cb'] })
  permissions: string[];

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

// --- Create Role ---
export class CreateRoleResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new Role' })
  message: string;

  @ApiProperty({ type: RoleItemDto })
  data: RoleItemDto;
}

// --- Get Roles (paginate) ---
class RoleListData {
  @ApiProperty({ type: [RoleItemDto] })
  items: RoleItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class GetRolesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list Role with paginate' })
  message: string;

  @ApiProperty({ type: RoleListData })
  data: RoleListData;
}

// --- Get Role by id ---
export class GetRoleResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch Role by id' })
  message: string;

  @ApiProperty({ type: RoleItemDto })
  data: RoleItemDto;
}

// --- Update Role ---
export class UpdateRoleResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a Role' })
  message: string;

  @ApiProperty({ type: RoleItemDto })
  data: RoleItemDto;
}

// --- Delete Role ---
export class DeleteRoleResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a Role' })
  message: string;

  @ApiProperty({ type: RoleItemDto })
  data: RoleItemDto;
}
