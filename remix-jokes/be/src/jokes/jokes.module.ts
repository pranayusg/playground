import { Module } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { JokesController } from './jokes.controller';
import { JokeRepository } from './jokes.repositary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([JokeRepository]), UsersModule],
  controllers: [JokesController],
  providers: [JokesService],
})
export class JokesModule {}
