import { Column, Entity } from 'typeorm';
import { SummaryDto } from '../dto/summary.dto';
import { AuditingEntity } from 'src/core/entities/auditing.entity';

@Entity()
export class Job extends AuditingEntity {
  @Column({ name: 'file_name' })
  fileName: string;

  @Column()
  status: string;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @Column({ type: 'jsonb', nullable: true, array: false })
  summary: SummaryDto[];

  @Column({ name: 'job_type', nullable: true })
  jobType: string;

  @Column({ name: 'import_type', nullable: true })
  importType: string;

  @Column({ name: 'error_file_link', nullable: true })
  errorFileLink: string;
}
