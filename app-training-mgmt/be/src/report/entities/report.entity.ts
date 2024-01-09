import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Report extends AuditingEntity {
  @Column()
  period: number;

  @Column({ type: 'jsonb', array: false })
  value: object;
}
