import { PartialType } from '@nestjs/swagger';
import { CreateCertificationOngoingDto } from './create-certification-ongoing.dto';

export class UpdateCertificationOngoingDto extends PartialType(
  CreateCertificationOngoingDto,
) {}
