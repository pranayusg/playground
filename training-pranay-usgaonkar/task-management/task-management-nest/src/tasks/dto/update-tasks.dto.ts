import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { CreateTasksDTO } from './create-tasks.dto';

export class UpdateTasksDTO extends PartialType(CreateTasksDTO) {
  @ApiProperty({ enum: ['in-progress', 'done'] })
  // @IsString()
  // @IsIn(['new', 'in-progress', 'done'])
  status: string;
}
