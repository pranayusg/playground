import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { FeedbackTraineesBatch } from 'src/feedback/feedback-trainees-batch/entities/feedback-trainees-batch.entity';
import { Tech } from 'src/tech/entities/tech.entity';
import { TrainingDetail } from 'src/training-detail/entities/training-detail.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Batch extends AuditingEntity {
  @Column({ name: 'batch_title' })
  batchTitle: string;

  @Column({ name: 'tech_topic' })
  techTopic: string;

  @Column({ name: 'start_date', type: 'timestamp without time zone' })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  endDate: Date;

  @Column({ name: 'training_coordinator' })
  trainingCoordinator: string;

  @Column({ name: 'head_trainer' })
  headTrainer: string;

  @Column()
  status: string;

  @TreeChildren()
  children: Batch[];

  @TreeParent()
  parent: Batch;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'feedback_comment', nullable: true })
  feedbackComment: string;

  @Column({ name: 'average_ratings_by_trainees', nullable: true })
  averageRatingsByTrainees: string;

  @Column({ name: 'no_of_trainees', nullable: true })
  noOfTrainees: number;

  @ManyToOne(() => Tech, (tech) => tech.batch, { nullable: true })
  @JoinColumn({ name: 'tech_id' })
  techId: Tech;

  @Column({ name: 'form_generated', default: false })
  formGenerated: boolean;

  @OneToMany(() => TrainingDetail, (trainingDetail) => trainingDetail.batchId)
  trainingDetail: TrainingDetail[];

  @OneToMany(() => BatchAssignmentOutline, (ao) => ao.batchId)
  batchAssignmentOutline: BatchAssignmentOutline[];

  @OneToMany(() => FeedbackTraineesBatch, (ftb) => ftb.batchId)
  feedbackTraineesBatch: FeedbackTraineesBatch[];
}
