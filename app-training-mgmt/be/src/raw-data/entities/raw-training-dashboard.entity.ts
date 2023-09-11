import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RawTrainingDashboard {
  @PrimaryColumn({ name: 'emp_id' })
  empId: string;

  @Column()
  name: string;

  @Column()
  designation: string;

  @Column({ name: 'reporting_manager' })
  reportingManager: string;

  @Column({ name: 'client_director' })
  clientDirector: string;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'resource_type', nullable: true })
  resourceType: string;

  @PrimaryColumn({ type: 'timestamp without time zone' })
  doj: Date;

  @Column({ nullable: true })
  trainer: string;

  @PrimaryColumn({ name: 'type_of_training' })
  typeOfTraining: string;

  @PrimaryColumn({ name: 'batche_type' })
  batchType: string;

  @PrimaryColumn({ name: 'batch_type_description' })
  batchTypeDescription: string;

  @Column({
    name: 'training_start_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  trainingStartDate: Date;

  @Column({
    name: 'training_end_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  trainingEndDate: Date;

  @Column({ name: 'batch_status', nullable: true })
  batchStatus: string;

  @Column({ name: 'employee_status', nullable: true })
  employeeStatus: string;

  @Column({ name: 'is_processed', nullable: true })
  isProcessed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
