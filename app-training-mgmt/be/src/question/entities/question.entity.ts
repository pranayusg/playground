import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuestionType } from '../question-type.enum';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { FeedbackTraineesBatch } from 'src/feedback/feedback-trainees-batch/entities/feedback-trainees-batch.entity';

@Entity()
export class Question extends AuditingEntity {
  @Column({ name: 'question_text' })
  questionText: string;

  @Column({ name: 'question_type', type: 'enum', enum: QuestionType })
  questionType: QuestionType;

  @OneToMany(() => QuestionOption, (option) => option.questionId)
  option: QuestionOption[];

  @OneToMany(() => FeedbackTraineesBatch, (ftb) => ftb.questionId)
  feedbackTraineesBatch: FeedbackTraineesBatch[];
}
