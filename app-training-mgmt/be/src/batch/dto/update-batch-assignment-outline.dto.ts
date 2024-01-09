import { PartialType } from '@nestjs/swagger';
import { CreateBatchAssignmentOutlineDto } from './create-batch-assignment-outline.dto';

export class UpdateBatchAssignmentOutlineDto extends PartialType(
  CreateBatchAssignmentOutlineDto,
) {}
