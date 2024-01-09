import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NormalizeService } from './normalize.service';

@Controller('normalize')
@ApiTags('Normalize')
export class NormalizeController {
  constructor(private normalizeService: NormalizeService) {}

  @ApiOperation({
    description:
      'Endpoint to Transfer the data from raw tables to normalized table',
  })
  @Get()
  normalize() {
    return this.normalizeService.transfer();
  }
}
