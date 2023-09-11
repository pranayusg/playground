import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RawActiveEmployee {
  @Column()
  employee: string;

  @PrimaryColumn({ name: 'employee_number' })
  employeeNumber: string;

  @Column()
  email: string;

  @Column()
  doj: Date;

  @Column({ name: 'reporting_to' })
  reportingTo: string;

  @Column({ name: 'curr_grade' })
  currGrade: string;

  @Column({ name: 'curr_location' })
  currLocation: string;

  @Column({ name: 'present_city' })
  presentCity: string;

  @Column({ name: 'present_state' })
  presentState: string;

  @Column({ name: 'curr_department' })
  currDepartment: string;

  @Column({ name: 'curr_designation' })
  currDesignation: string;

  @Column({ name: 'curr_des_for_reporting' })
  currDesForReporting: string;

  @Column({ name: 'leaving_date', nullable: true })
  leavingDate: Date;

  @Column({ name: 'curr_client_1' })
  currClient1: string;

  @Column({ name: 'curr_client_2', nullable: true })
  currClient2: string;

  @Column({ name: 'curr_client_3', nullable: true })
  currClient3: string;

  @Column({ name: 'curr_client_4', nullable: true })
  currClient4: string;

  @Column({ name: 'curr_experience' })
  currExperience: number;

  @Column({ name: 'curr_previous_employer_experience', nullable: true })
  currPreviousEmployerExperience: number;

  @Column({ name: 'years_served_in_curr_designation' })
  yearsServedInCurrDesignation: number;

  @Column({ name: 'curr_designation_since', nullable: true })
  currDesignationSince: Date;

  @Column({ name: 'curr_business_system_qualification', nullable: true })
  currBusinessSystemQualification: string;

  @Column({ name: 'curr_core_tech_stack' })
  currCoreTechStack: string;

  @Column({ name: 'curr_secondary_tech_stack', nullable: true })
  currSecondaryTechStack: string;

  @Column({ name: 'curr_managerial_qualification', nullable: true })
  currManagerialQualification: string;

  @Column({ name: 'curr_personal_interests', nullable: true })
  currPresonalInterests: string;

  @Column({ name: 'employee_status' })
  employeeStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
