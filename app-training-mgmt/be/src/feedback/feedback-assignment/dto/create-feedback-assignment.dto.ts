import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { AssignmentStatus } from '../assignment-status.enum';

export class CreateFeedbackAssignmentDto {
  @ApiProperty()
  @IsNotEmpty()
  batchAssignmentOutlineId: BatchAssignmentOutline;

  @ApiProperty()
  @IsNotEmpty()
  empId: Employee;

  @ApiProperty()
  @IsNotEmpty()
  ratings: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  overallRating: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  submissionDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AssignmentStatus)
  status: AssignmentStatus;
}
