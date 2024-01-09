import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentOutlineDto } from './create-assignment-outline.dto';

export class UpdateAssignmentOutlineDto extends PartialType(
  CreateAssignmentOutlineDto,
) {}
