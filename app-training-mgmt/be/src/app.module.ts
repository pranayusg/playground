import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './Job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RawDataModule } from './raw-data/raw-data.module';
import { EmployeeModule } from './employee/employee.module';
import { BatchModule } from './batch/batch.module';
import { TrainingDetailModule } from './training-detail/training-detail.module';
import { databaseAsyncConfig } from './config/database-config';
import { NormalizeModule } from './normalize/normalize.module';
import { AuthModule } from './auth/auth.module';
import { SystemUserModule } from './system-user/system-user.module';
import { EmailModule } from './email/email.module';
import { CacheModule } from '@nestjs/cache-manager';
import { configVaidationSchema } from './core/config.schema';
import { AssignmentOutlineModule } from './assignment-outline/assignment-outline.module';
import { TechModule } from './tech/tech.module';
import { QuestionModule } from './question/question.module';
import { QuestionOptionModule } from './question-option/question-option.module';
import { ReportModule } from './report/report.module';
import { EvaluationCriteriaModule } from './evaluation-criteria/evaluation-criteria.module';
import { CertificationModule } from './certification/certification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RequestLoggerMiddleware } from './core/middleware/request-logger.middleware';
import { CustomLogger } from './core/logger/logger.service';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      isGlobal: true,
      validationSchema: configVaidationSchema,
    }),
    TypeOrmModule.forRootAsync(databaseAsyncConfig),
    ScheduleModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    WinstonModule.forRoot({}),
    JobModule,
    RawDataModule,
    EmployeeModule,
    BatchModule,
    TrainingDetailModule,
    CertificationModule,
    NormalizeModule,
    AuthModule,
    SystemUserModule,
    EmailModule,
    TechModule,
    AssignmentOutlineModule,
    QuestionModule,
    QuestionOptionModule,
    FeedbackModule,
    ReportModule,
    EvaluationCriteriaModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
