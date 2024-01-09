import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EmployeeStatus } from '../employee-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  doj: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reportingTo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currDesignation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currClient1: string;

  @ApiProperty()
  @IsString()
  currClient2: string;

  @ApiProperty()
  @IsString()
  currClient3: string;

  @ApiProperty()
  @IsString()
  currClient4: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  coreTechStack: string;

  @ApiProperty()
  @IsString()
  secondaryTechStack: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;
}
