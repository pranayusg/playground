import { AssignmentOutline } from 'src/assignment-outline/entities/assignment-outline.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Tech } from 'src/tech/entities/tech.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class TechTraining extends AuditingEntity {
  @ManyToOne(() => Tech, (tech) => tech.techTraining)
  @JoinColumn({ name: 'tech_id' })
  techId: Tech;

  @Column()
  topic: string;

  @Column()
  description: string;

  @Column()
  level: string;

  @OneToMany(() => AssignmentOutline, (aa) => aa.techTrainingId)
  assignmetOutlineId: AssignmentOutline[];
}
