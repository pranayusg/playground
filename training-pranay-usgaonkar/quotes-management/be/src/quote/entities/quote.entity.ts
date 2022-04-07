import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quote: string;

  @Column()
  author: string;

  @Column({
    default: 0,
  })
  likes: number;

  @Column({
    default: 0,
  })
  dislikes: number;

  @Column({
    nullable: true,
  })
  tags: string;
}
