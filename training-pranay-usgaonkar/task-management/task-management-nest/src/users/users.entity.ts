import { Task } from 'src/tasks/entities/tasks.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  middleName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  isAdmin: Boolean;

  @OneToMany(() => Task, (task: Task) => task.user)
  tasks: Task[];

  
}
