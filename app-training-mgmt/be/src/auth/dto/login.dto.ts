import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;
}
