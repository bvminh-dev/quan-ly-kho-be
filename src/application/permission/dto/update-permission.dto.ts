import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Create User', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '/api/v1/users', required: false })
  apiPath?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'POST', required: false })
  method?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'users', required: false })
  module?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Permission to create a user', required: false })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}
