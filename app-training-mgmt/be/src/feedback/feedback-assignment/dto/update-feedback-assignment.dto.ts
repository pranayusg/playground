import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackAssignmentDto } from './create-feedback-assignment.dto';

export class UpdateFeedbackAssignmentDto extends PartialType(
  CreateFeedbackAssignmentDto,
) {}
