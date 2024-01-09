import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Batch } from 'src/batch/entities/batch.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { Question } from 'src/question/entities/question.entity';

export class CreateFeedbackTraineesBatchDto {
  @ApiProperty()
  questionId: Question;

  @ApiProperty()
  answerOptionId: QuestionOption;

  @ApiProperty()
  @IsString()
  answerText: string;

  @ApiProperty()
  batchId: Batch;

  @ApiProperty()
  empId: Employee;
}
