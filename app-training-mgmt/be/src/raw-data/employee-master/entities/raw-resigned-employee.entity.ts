import { RawAuditingEntity } from 'src/core/entities/rawAuditing.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RawResignedEmployee extends RawAuditingEntity {
  @Column()
  employee: string;

  @PrimaryColumn({ name: 'employee_number' })
  employeeNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  doj: Date;

  @Column({ name: 'reporting_to', nullable: true })
  reportingTo: string;

  @Column({ name: 'curr_grade', nullable: true })
  currGrade: string;

  @Column({ name: 'curr_location', nullable: true })
  currLocation: string;

  @Column({ name: 'present_city', nullable: true })
  presentCity: string;

  @Column({ name: 'present_state', nullable: true })
  presentState: string;

  @Column({ name: 'curr_department', nullable: true })
  currDepartment: string;

  @Column({ name: 'curr_designation' })
  currDesignation: string;

  @Column({ name: 'curr_des_for_reporting', nullable: true })
  currDesForReporting: string;

  @Column({ name: 'leaving_date' })
  leavingDate: Date;

  @Column({ name: 'curr_client_1', nullable: true })
  currClient1: string;

  @Column({ name: 'curr_client_2', nullable: true })
  currClient2: string;

  @Column({ name: 'curr_client_3', nullable: true })
  currClient3: string;

  @Column({ name: 'curr_client_4', nullable: true })
  currClient4: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'curr_experience',
    nullable: true,
  })
  currExperience: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'curr_previous_employer_experience',
    nullable: true,
  })
  currPreviousEmployerExperience: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'years_served_in_curr_designation',
    nullable: true,
  })
  yearsServedInCurrDesignation: number;

  @Column({ name: 'curr_designation_since', nullable: true })
  currDesignationSince: Date;

  @Column({ name: 'curr_business_system_qualification', nullable: true })
  currBusinessSystemQualification: string;

  @Column({ name: 'curr_core_tech_stack', nullable: true })
  currCoreTechStack: string;

  @Column({ name: 'curr_secondary_tech_stack', nullable: true })
  currSecondaryTechStack: string;

  @Column({ name: 'curr_managerial_qualification', nullable: true })
  currManagerialQualification: string;

  @Column({ name: 'curr_personal_interests', nullable: true })
  currPresonalInterests: string;

  @Column({ name: 'employee_status' })
  employeeStatus: string;

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;
}
