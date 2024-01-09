import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CertificationApproved } from 'src/certification/certification-approved/entities/certification-approved.entity';
import { Employee } from 'src/employee/entities/employee.entity';

export class CreateCertificationAchievedDto {
  @ApiProperty()
  @IsNotEmpty()
  empId: Employee;

  @ApiProperty()
  @IsNotEmpty()
  exam: CertificationApproved;

  @ApiProperty()
  achievedDate: Date;

  @ApiProperty()
  expiryDate: Date;

  @ApiProperty()
  certificationLink: string;
}
