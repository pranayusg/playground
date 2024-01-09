import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Question } from 'src/question/entities/question.entity';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  optionText: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  questionId: Question;
}
