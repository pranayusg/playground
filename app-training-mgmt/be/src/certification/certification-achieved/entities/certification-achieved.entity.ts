import { CertificationApproved } from 'src/certification/certification-approved/entities/certification-approved.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CertificationAchieved extends AuditingEntity {
  @ManyToOne(() => Employee, (emp) => emp.id)
  @JoinColumn({ name: 'emp_id' })
  empId: Employee;

  @ManyToOne(() => CertificationApproved, (cert) => cert.id)
  @JoinColumn({ name: 'exam_id' })
  exam: CertificationApproved;

  @Column({ name: 'achieved_date', type: 'timestamp without time zone' })
  achievedDate: Date;

  @Column({
    name: 'expiry_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  expiryDate: Date;

  @Column({ name: 'certification_link', nullable: true })
  certificationLink: string;
}
