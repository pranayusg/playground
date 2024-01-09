import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/core/enum/role.enum';

export class CreateSystemUserDto {
  @ApiProperty()
  @MinLength(8)
  @MaxLength(8)
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/^(?=.*\d)/, {
    message: 'Password must contain at least one digit.',
  })
  @Matches(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character (!@#$%^&*).',
  })
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  type?: Role;

  @IsDate()
  @IsOptional()
  lastLoggedIn?: Date;

  @IsObject()
  @IsOptional()
  state?: object;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
