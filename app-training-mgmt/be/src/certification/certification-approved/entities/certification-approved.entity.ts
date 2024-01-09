import { CertificationAchieved } from 'src/certification/certification-achieved/entities/certification-achieved.entity';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class CertificationApproved extends AuditingEntity {
  @Column()
  tech: string;

  @Column({ name: 'certification_name' })
  certificationName: string;

  @Column()
  level: string;

  @Column({ name: 'cost_in_dollar', nullable: true })
  costInDollars: number;

  @OneToMany(() => CertificationAchieved, (cert) => cert.exam)
  certificationAchieved: CertificationAchieved[];
}
