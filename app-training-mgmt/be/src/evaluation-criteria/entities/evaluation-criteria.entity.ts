import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class EvaluationCriteria extends AuditingEntity {
  @Column()
  name: string;
}
