import { ApiProperty } from '@nestjs/swagger';
import { SummaryDto } from './summary.dto';

export class CreateJobDto {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  summary: SummaryDto[];

  @ApiProperty()
  jobType: string;

  @ApiProperty()
  importType: string;

  @ApiProperty()
  filePath: string;
}
