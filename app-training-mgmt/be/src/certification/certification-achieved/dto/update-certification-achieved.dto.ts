import { PartialType } from '@nestjs/swagger';
import { CreateCertificationAchievedDto } from './create-certification-achieved.dto';

export class UpdateCertificationAchievedDto extends PartialType(
  CreateCertificationAchievedDto,
) {}
