import { PartialType } from '@nestjs/swagger';
import { CreateCertificationApprovedDto } from './create-approved-certification.dto';

export class UpdateCertificationApprovedDto extends PartialType(
  CreateCertificationApprovedDto,
) {}
