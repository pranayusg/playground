import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  quote: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  author: string;

  @IsOptional()
  @IsInt()
  likes: number;

  @IsOptional()
  @IsInt()
  dislikes: number;

  @ApiProperty({ description: 'semicolon-separated values' })
  @IsOptional()
  @IsString()
  tags: string;
}
