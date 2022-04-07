import { Quote } from 'src/quote/entities/quote.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('favouriteQuote')
export class FavouriteQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Quote, { eager: true, cascade: true })
  @JoinColumn()
  quote: Quote;

  @Column({
    default: false,
  })
  like: boolean;

  @Column({
    default: false,
  })
  dislike: boolean;
}
