import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword456' })
  newPassword: string;
}
