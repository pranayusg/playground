import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateFormDto {
  @ApiProperty()
  @IsString()
  validity: string;
}
