import { Exclude } from 'class-transformer';
import { Role } from 'src/core/enum/role.enum';
import { Employee } from 'src/employee/entities/employee.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class SystemUser {
  @OneToOne(() => Employee, (emp) => emp.id)
  @PrimaryColumn({ name: 'username' })
  @JoinColumn({ name: 'username' })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Role, nullable: true })
  type: Role;

  @Column({
    name: 'last_logged_in',
    type: 'timestamp without time zone',
    nullable: true,
  })
  lastLoggedIn: Date;

  @Column({ type: 'jsonb', nullable: true, array: false })
  state: object;

  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken: string;
}
