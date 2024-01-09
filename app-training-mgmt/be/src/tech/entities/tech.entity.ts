import { Batch } from 'src/batch/entities/batch.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { TechTraining } from 'src/tech/entities/tech_training.entity';
import {
  Column,
  Entity,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Tech extends AuditingEntity {
  @Column()
  name: string;

  @TreeChildren()
  children: Tech[];

  @TreeParent()
  parent: Tech;

  @OneToMany(() => Batch, (batch) => batch.techId, { nullable: true })
  batch: Batch[];

  @OneToMany(() => TechTraining, (tt) => tt.techId)
  techTraining: TechTraining[];
}
