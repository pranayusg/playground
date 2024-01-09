import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDetailDto } from './create-training-detail.dto';

export class UpdateTrainingDetailDto extends PartialType(
  CreateTrainingDetailDto,
) {}
