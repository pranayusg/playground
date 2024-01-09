import { Batch } from 'src/batch/entities/batch.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class TrainingDetail extends AuditingEntity {
  @ManyToOne(() => Employee, (emp) => emp.id)
  @JoinColumn({ name: 'emp_id' })
  empId: string;

  @ManyToOne(() => Batch, (batch) => batch.id)
  @JoinColumn({ name: 'batch_id' })
  batchId: string;
}
