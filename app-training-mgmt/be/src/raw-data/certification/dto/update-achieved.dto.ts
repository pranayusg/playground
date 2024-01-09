import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAchievedDto } from './create-achieved.dto';

export class UpdateAchievedDto extends PartialType(CreateAchievedDto) {
  @ApiProperty()
  isProcessed?: boolean;
}
