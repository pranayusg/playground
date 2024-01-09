import { Module } from '@nestjs/common';
import { SystemUserService } from './system-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from './entities/system-user.entity';
import { SystemUserRepository } from './system-user.respository';
import { SystemUserController } from './system-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser])],
  providers: [SystemUserService, SystemUserRepository],
  exports: [SystemUserService],
  controllers: [SystemUserController],
})
export class SystemUserModule {}
