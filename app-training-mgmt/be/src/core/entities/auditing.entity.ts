import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PersistentEntity } from './persistent.entity';

export abstract class AuditingEntity extends PersistentEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
