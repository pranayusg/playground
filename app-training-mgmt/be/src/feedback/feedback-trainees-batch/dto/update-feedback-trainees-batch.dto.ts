import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackTraineesBatchDto } from './create-feedback-trainees-batch.dto';

export class UpdateFeedbackTraineesBatchDto extends PartialType(
  CreateFeedbackTraineesBatchDto,
) {}
