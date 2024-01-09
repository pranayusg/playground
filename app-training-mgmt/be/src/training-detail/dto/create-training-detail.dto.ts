import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrainingDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  empId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  batchId: string;
}
