import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TrainingDashDto } from './training-dash.dto';

export class UpdateTrainingDashDto extends PartialType(TrainingDashDto) {
  @ApiProperty()
  isProcessed?: boolean;
}
