import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  period: number;

  @ApiProperty()
  @IsObject()
  value: object;
}
