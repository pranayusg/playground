import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackAssignment } from './feedback-assignment/entities/feedback-assignment.entity';
import { FeedbackAssignmentRepository } from './feedback-assignment/feedback-assignment.repository';
import { FeedbackAssignmentService } from './feedback-assignment/feedback-assignment.service';
import { FeedbackTraineesBatch } from './feedback-trainees-batch/entities/feedback-trainees-batch.entity';
import { FeedbackTraineesBatchRepository } from './feedback-trainees-batch/feedback-trainees-batch.repository';
import { FeedbackTraineesBatchService } from './feedback-trainees-batch/feedback-trainees-batch.service';
import { AuthModule } from 'src/auth/auth.module';
import { BatchModule } from 'src/batch/batch.module';
import { EmailModule } from 'src/email/email.module';
import { TrainingDetailModule } from 'src/training-detail/training-detail.module';
import { FeedbackAssignmentActivity } from './feedback-assignment/entities/feedback-assignment-activity.entity';
import { FeedbackAssignmentActivityRepository } from './feedback-assignment/feedback-assignment-activity.repository';
import { FeedbackTraineesBatchActivityRepository } from './feedback-trainees-batch/feedback-trainees-batch-activity.repository';
import { FeedbackTraineesBatchActivity } from './feedback-trainees-batch/entities/feedback-trainees-batch-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedbackAssignment,
      FeedbackTraineesBatch,
      FeedbackAssignmentActivity,
      FeedbackTraineesBatchActivity,
    ]),
    BatchModule,
    EmailModule,
    AuthModule,
    TrainingDetailModule,
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackAssignmentService,
    FeedbackAssignmentRepository,
    FeedbackTraineesBatchService,
    FeedbackTraineesBatchRepository,
    FeedbackAssignmentActivityRepository,
    FeedbackTraineesBatchActivityRepository,
  ],
  exports: [
    FeedbackAssignmentService,
    FeedbackAssignmentRepository,
    FeedbackTraineesBatchService,
    FeedbackTraineesBatchRepository,
    FeedbackAssignmentActivityRepository,
    FeedbackTraineesBatchActivityRepository,
  ],
})
export class FeedbackModule {}
