import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './Job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/typeorm-config';
//import { EmployeeMasterActiveModule } from './excel-sheets/employee-master-active/employee-master-active.module';
//import { EmployeeMasterResignedModule } from './excel-sheets/employee-master-resigned/employee-master-resigned.module';
import { RawDataModule } from './raw-data/raw-data.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ScheduleModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    JobModule,
    RawDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
