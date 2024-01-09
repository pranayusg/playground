import { ApiProperty } from '@nestjs/swagger';
import { CertificationApproved } from 'src/certification/certification-approved/entities/certification-approved.entity';
import { Employee } from 'src/employee/entities/employee.entity';

export class CreateCertificationOngoingDto {
  @ApiProperty()
  empId: Employee;

  @ApiProperty()
  exam: CertificationApproved;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  expectedEndDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  when: string;

  @ApiProperty()
  what: string;
}
