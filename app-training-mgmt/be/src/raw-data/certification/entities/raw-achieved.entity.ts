import { RawAuditingEntity } from 'src/core/entities/rawAuditing.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RawAchieved extends RawAuditingEntity {
  @PrimaryColumn({ name: 'emp_id' })
  empId: string;

  @PrimaryColumn({ name: 'name' })
  name: string;

  @PrimaryColumn()
  certification: string;

  @PrimaryColumn()
  level: string;

  @PrimaryColumn()
  exam: string;

  @Column({ name: 'achieved_date', type: 'timestamp without time zone' })
  achievedDate: Date;

  @Column({
    name: 'expiry_date',
    nullable: true,
    type: 'timestamp without time zone',
  })
  expiryDate: Date;

  @Column({ name: 'certification_link' })
  certificationLink: string;

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;
}
