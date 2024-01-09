import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRawEmployeeDto } from './create-raw-active-employee.dto';

export class UpdateRawEmployeeDto extends PartialType(CreateRawEmployeeDto) {
  @ApiProperty()
  isProcessed?: boolean;
}
