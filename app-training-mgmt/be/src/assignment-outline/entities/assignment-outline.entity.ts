import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { TechTraining } from 'src/tech/entities/tech_training.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class AssignmentOutline extends AuditingEntity {
  @ManyToOne(() => TechTraining, (tt) => tt.assignmetOutlineId)
  @JoinColumn({ name: 'tech_training_id' })
  techTrainingId: TechTraining;

  @Column()
  topic: string;

  @Column()
  duration: number;

  @Column({ nullable: true })
  link: string;

  @Column({ name: 'rating_keys', type: 'jsonb' })
  ratingKeys: object;

  @OneToMany(() => BatchAssignmentOutline, (ao) => ao.assignmentOutlineId)
  batchAssignmentOutline: BatchAssignmentOutline[];
}
