import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Create User' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '/api/v1/users' })
  apiPath: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'POST' })
  method: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'users' })
  module: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Permission to create a user', required: false })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}
