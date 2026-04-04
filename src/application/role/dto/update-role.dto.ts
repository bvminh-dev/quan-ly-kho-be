import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'moderator', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Moderator role', required: false })
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({ example: ['60d0fe4f5311236168a109ca'], required: false })
  permissions?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  isViewAllUser?: boolean;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: [{ _id: '123', apiPath: '/api/v1/users', method: 'GET' }],
    required: false,
  })
  viewAllUserApis?: Array<{ _id: string; apiPath: string; method: string }>;
}
