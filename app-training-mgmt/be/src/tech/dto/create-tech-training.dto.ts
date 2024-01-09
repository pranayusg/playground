import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Tech } from 'src/tech/entities/tech.entity';

export class CreateTechTrainingDto {
  @ApiProperty()
  @IsNotEmpty()
  techId: Tech;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  level: string;
}
