import { Batch } from 'src/batch/entities/batch.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['questionId', 'batchId', 'empId'])
export class FeedbackTraineesBatch extends AuditingEntity {
  @ManyToOne(() => Question, (qts) => qts.feedbackTraineesBatch)
  @JoinColumn({ name: 'question_id' })
  questionId: Question;

  @ManyToOne(() => QuestionOption, (option) => option.feedbackTraineesBatch, {
    nullable: true,
  })
  @JoinColumn({ name: 'answer_option_id' })
  answerOptionId: QuestionOption;

  @Column({ name: 'answer_text', nullable: true })
  answerText: string;

  @ManyToOne(() => Batch, (batch) => batch.feedbackTraineesBatch)
  @JoinColumn({ name: 'batch_id' })
  batchId: Batch;

  @ManyToOne(() => Employee, (emp) => emp.feedbackTraineesBatch)
  @JoinColumn({ name: 'emp_id' })
  empId: Employee;
}
