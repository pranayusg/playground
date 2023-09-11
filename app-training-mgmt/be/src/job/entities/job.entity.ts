import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SummaryDto } from '../dto/summary.dto';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid', { name: 'job_id' })
  jobId: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
