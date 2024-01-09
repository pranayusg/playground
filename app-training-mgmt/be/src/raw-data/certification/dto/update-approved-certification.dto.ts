import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateApprovedCertificationDto } from './create-approved-certification.dto';

export class UpdateApprovedCertificationDTO extends PartialType(
  CreateApprovedCertificationDto,
) {
  @ApiProperty()
  isProcessed?: boolean;
}
