import { ApiProperty } from '@nestjs/swagger';
import { Batch } from 'src/batch/entities/batch.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Question } from 'src/question/entities/question.entity';

class questionsObject {
  @ApiProperty()
  question: Question;

  @ApiProperty()
  answer: any;
}

export class CreateAllFeedbackTraineesBatchDto {
  @ApiProperty({ type: [questionsObject] })
  questions: questionsObject[];

  @ApiProperty()
  batchId: Batch;

  @ApiProperty()
  empId: Employee;
}
