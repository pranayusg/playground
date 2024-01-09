import { ApiProperty } from '@nestjs/swagger';

export class CreateRawEmployeeDto {
  @ApiProperty()
  employee: string;

  @ApiProperty()
  employeeNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  doj: Date;

  @ApiProperty()
  reportingTo: string;

  @ApiProperty()
  currGrade: string;

  @ApiProperty()
  currLocation: string;

  @ApiProperty()
  presentCity: string;

  @ApiProperty()
  presentState: string;

  @ApiProperty()
  currDepartment: string;

  @ApiProperty()
  currDesignation: string;

  @ApiProperty()
  currDesForReporting: string;

  @ApiProperty()
  leavingDate: Date;

  @ApiProperty()
  currClient1: string;

  @ApiProperty()
  currClient2: string;

  @ApiProperty()
  currClient3: string;

  @ApiProperty()
  currClient4: string;

  @ApiProperty()
  currExperience: number;

  @ApiProperty()
  currPreviousEmployerExperience: number;

  @ApiProperty()
  yearsServedInCurrDesignation: number;

  @ApiProperty()
  currDesignationSince: Date;

  @ApiProperty()
  currBusinessSystemQualification: string;

  @ApiProperty()
  currCoreTechStack: string;

  @ApiProperty()
  currSecondaryTechStack: string;

  @ApiProperty()
  currManagerialQualification: string;

  @ApiProperty()
  currPresonalInterests: string;

  @ApiProperty()
  employeeStatus: string;
}
