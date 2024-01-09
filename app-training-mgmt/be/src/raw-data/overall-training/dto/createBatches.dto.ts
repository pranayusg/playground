import { ApiProperty } from '@nestjs/swagger';

export class BatchesDto {
  @ApiProperty()
  batchTitle: string;

  @ApiProperty()
  tech: string;

  @ApiProperty()
  startDate: any;

  @ApiProperty()
  endDate: any;

  @ApiProperty()
  trainingCoordinator: string;

  @ApiProperty()
  headTrainer: string;

  @ApiProperty()
  noOfTrainees: number | null;

  @ApiProperty()
  noSuccess: number | null;

  @ApiProperty()
  noFailed: number | null;

  @ApiProperty()
  status: string | null;
}
