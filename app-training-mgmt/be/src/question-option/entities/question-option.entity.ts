import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { FeedbackTraineesBatch } from 'src/feedback/feedback-trainees-batch/entities/feedback-trainees-batch.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class QuestionOption extends AuditingEntity {
  @Column({ name: 'option_text' })
  optionText: string;

  @Column()
  order: number;

  @ManyToOne(() => Question, (qts) => qts.option)
  @JoinColumn({ name: 'question_id' })
  questionId: Question;

  @OneToMany(() => FeedbackTraineesBatch, (ftb) => ftb.answerOptionId)
  feedbackTraineesBatch: FeedbackTraineesBatch[];
}
