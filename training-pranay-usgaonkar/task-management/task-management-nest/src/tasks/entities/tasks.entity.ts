import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column({ name: 'userid' })
  userid: string;

  @ManyToOne(() => User, (user: User) => user.tasks)
  @JoinColumn({ name: 'userid' })
  user: User;
}
