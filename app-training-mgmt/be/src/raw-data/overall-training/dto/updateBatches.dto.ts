import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BatchesDto } from './createBatches.dto';

export class UpdateBatchesDto extends PartialType(BatchesDto) {
  @ApiProperty()
  isProcessed?: boolean;
}
