import { AssignmentOutline } from 'src/assignment-outline/entities/assignment-outline.entity';
import { Batch } from 'src/batch/entities/batch.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { FeedbackAssignment } from 'src/feedback/feedback-assignment/entities/feedback-assignment.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class BatchAssignmentOutline extends AuditingEntity {
  @ManyToOne(() => AssignmentOutline, (ao) => ao.batchAssignmentOutline)
  @JoinColumn({ name: 'assignment_outline_id' })
  assignmentOutlineId: AssignmentOutline;

  @ManyToOne(() => Batch, (batch) => batch.batchAssignmentOutline)
  @JoinColumn({ name: 'batch_id' })
  batchId: Batch;

  @Column({ name: 'start_date', type: 'timestamp without time zone' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp without time zone' })
  endDate: Date;

  @OneToMany(() => FeedbackAssignment, (fa) => fa.batchAssignmentOutlineId)
  feedbackAssignment: FeedbackAssignment[];
}
