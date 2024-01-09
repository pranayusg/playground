import { RawAuditingEntity } from 'src/core/entities/rawAuditing.entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawBatch extends RawAuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ name: 'batch_title' })
  batchTitle: string;

  @PrimaryColumn()
  tech: string;

  @PrimaryColumn({ name: 'start_date', type: 'timestamp without time zone' })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  endDate: Date | null;

  @PrimaryColumn({ name: 'training_coordinator' })
  trainingCoordinator: string;

  @PrimaryColumn({ name: 'head_trainer' })
  headTrainer: string;

  @Column({ name: 'no_of_trainees', nullable: true })
  noOfTrainees: number | null;

  @Column({ name: 'no_of_success', nullable: true })
  noSuccess: number | null;

  @Column({ name: 'no_of_failed', nullable: true })
  noFailed: number | null;

  @Column({ nullable: true })
  status: string | null;

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;
}
