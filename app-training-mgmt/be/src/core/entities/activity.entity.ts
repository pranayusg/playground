import { Column } from 'typeorm';
import { AuditingEntity } from './auditing.entity';

export abstract class ActivityTracking extends AuditingEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'record_id' })
  recordId: string;

  @Column({
    name: 'existing_data',
    type: 'jsonb',
    nullable: true,
    array: false,
  })
  existingData: object;

  @Column({ name: 'new_date', type: 'jsonb', nullable: true, array: false })
  newData: object;
}
