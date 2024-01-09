import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuestionType } from '../question-type.enum';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty()
  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;
}
