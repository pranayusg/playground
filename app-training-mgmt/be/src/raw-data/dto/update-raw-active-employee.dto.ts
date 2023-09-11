import { PartialType } from '@nestjs/swagger';
import { CreateRawActiveEmployeeDto } from './create-raw-active-employee.dto';

export class UpdateRawActiveEmployeeDto extends PartialType(
  CreateRawActiveEmployeeDto,
) {}
