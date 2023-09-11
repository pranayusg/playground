import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RawBatch {
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
  NoOfTrainees: number | null;

  @Column({ name: 'no_of_success', nullable: true })
  NoSuccess: number | null;

  @Column({ name: 'no_of_failed', nullable: true })
  NoFailed: number | null;

  @Column({ nullable: true })
  status: string | null;

  @Column({ name: 'is_processed', nullable: true })
  isProcessed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
