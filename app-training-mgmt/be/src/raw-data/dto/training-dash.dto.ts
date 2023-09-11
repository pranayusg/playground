import { ApiProperty } from '@nestjs/swagger';

export class TrainingDashDto {
  @ApiProperty()
  empId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  designation: string;

  @ApiProperty()
  reportingManager: string;

  @ApiProperty()
  clientDirector: string;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  resourceType: string;

  @ApiProperty()
  doj: any;

  @ApiProperty()
  trainer: string;

  @ApiProperty()
  typeOfTraining: string;

  @ApiProperty()
  batchType: string;

  @ApiProperty()
  batchTypeDescription: string;

  @ApiProperty()
  trainingStartDate: any;

  @ApiProperty()
  trainingEndDate: any;

  @ApiProperty()
  batchStatus: string;

  @ApiProperty()
  employeeStatus: string;
}
