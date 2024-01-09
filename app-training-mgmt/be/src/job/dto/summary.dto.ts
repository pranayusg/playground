import { ApiProperty } from '@nestjs/swagger';

export class SummaryDto {
  @ApiProperty()
  sheetName: string;

  @ApiProperty()
  rowsInserted: number;

  @ApiProperty()
  rowsUpdated: number;

  @ApiProperty()
  rowsRejected: number;
}
