import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TechTraining } from 'src/tech/entities/tech_training.entity';

export class CreateAssignmentOutlineDto {
  @ApiProperty()
  @IsNotEmpty()
  techTrainingId: TechTraining;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty()
  @IsString()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  ratingKeys: object;
}
