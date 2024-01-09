import { RawAuditingEntity } from 'src/core/entities/rawAuditing.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RawTrainingDashboard extends RawAuditingEntity {
  @PrimaryColumn({ name: 'emp_id' })
  empId: string;

  @PrimaryColumn()
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

  @Column({ type: 'timestamp without time zone', nullable: true })
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

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;
}
