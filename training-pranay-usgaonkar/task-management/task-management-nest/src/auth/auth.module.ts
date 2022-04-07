import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/users.entity';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { TasksService } from 'src/tasks/tasks.service';
import { TasksRepository } from 'src/tasks/tasks.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TasksRepository]),
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    TasksService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
