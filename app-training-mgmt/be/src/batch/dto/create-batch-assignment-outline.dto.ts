import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AssignmentOutline } from 'src/assignment-outline/entities/assignment-outline.entity';
import { Batch } from 'src/batch/entities/batch.entity';

export class CreateBatchAssignmentOutlineDto {
  @ApiProperty()
  @IsNotEmpty()
  assignmentOutlineId: AssignmentOutline;

  @ApiProperty()
  @IsNotEmpty()
  batchId: Batch;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;
}
