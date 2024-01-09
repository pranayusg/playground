import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AssignmentStatus } from '../assignment-status.enum';
import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';

@Entity()
export class FeedbackAssignment extends AuditingEntity {
  @ManyToOne(() => BatchAssignmentOutline, (bao) => bao.feedbackAssignment)
  @JoinColumn({ name: 'batch_assignment_outline_id' })
  batchAssignmentOutlineId: BatchAssignmentOutline;

  @ManyToOne(() => Employee, (emp) => emp.feedbackAssignment)
  @JoinColumn({ name: 'emp_id' })
  empId: Employee;

  @Column({ type: 'jsonb', nullable: true, array: false })
  ratings: object;

  @Column({ name: 'overall_rating' })
  overallRating: string;

  @Column()
  comment: string;

  @Column({ name: 'submission_date', nullable: true })
  submissionDate: Date;

  @Column({ type: 'enum', enum: AssignmentStatus })
  status: AssignmentStatus;
}
