import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { EmployeeStatus } from '../employee-status.enum';
import { TrainingDetail } from 'src/training-detail/entities/training-detail.entity';
import { CertificationAchieved } from 'src/certification/certification-achieved/entities/certification-achieved.entity';
import { CertificationOngoing } from 'src/certification/certification-ongoing/entities/certification-ongoing.entity';
import { SystemUser } from 'src/system-user/entities/system-user.entity';
import { FeedbackAssignment } from 'src/feedback/feedback-assignment/entities/feedback-assignment.entity';
import { FeedbackTraineesBatch } from 'src/feedback/feedback-trainees-batch/entities/feedback-trainees-batch.entity';

@Entity()
export class Employee {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  doj: Date;

  @Column({ name: 'reporting_to', nullable: true })
  reportingTo: string;

  @Column({ name: 'curr_designation' })
  currDesignation: string;

  @Column({ name: 'curr_client1', nullable: true })
  currClient1: string;

  @Column({ name: 'curr_client2', nullable: true })
  currClient2: string;

  @Column({ name: 'curr_client3', nullable: true })
  currClient3: string;

  @Column({ name: 'curr_client4', nullable: true })
  currClient4: string;

  @Column({ name: 'core_tech_stack', nullable: true })
  coreTechStack: string;

  @Column({ name: 'secondary_tech_stack', nullable: true })
  secondaryTechStack: string;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.Active,
  })
  status: EmployeeStatus;

  @OneToMany(() => TrainingDetail, (trainingDetail) => trainingDetail.empId)
  trainingDetail: TrainingDetail[];

  @OneToMany(() => CertificationAchieved, (cert) => cert.empId)
  certificationAchieved: CertificationAchieved[];

  @OneToMany(() => CertificationOngoing, (cert) => cert.empId)
  certificationOngoing: CertificationOngoing[];

  @OneToOne(() => SystemUser, (cred) => cred.username)
  credential: SystemUser;

  @OneToMany(() => FeedbackAssignment, (fa) => fa.empId)
  feedbackAssignment: FeedbackAssignment[];

  @OneToMany(() => FeedbackTraineesBatch, (ftb) => ftb.empId)
  feedbackTraineesBatch: FeedbackTraineesBatch[];
}
