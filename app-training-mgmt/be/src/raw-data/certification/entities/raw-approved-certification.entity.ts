import { RawAuditingEntity } from 'src/core/entities/rawAuditing.entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawApprovedCertification extends RawAuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  tech: string;

  @PrimaryColumn({ name: 'certificaton_name' })
  certificationName: string;

  @PrimaryColumn()
  level: string;

  @Column({ name: 'cost_in_dollars', nullable: true })
  costInDollars: number;

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;
}
