import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ReportService } from './report.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/core/enum/role.enum';
import { REPORT_PERIODS } from 'src/core/constant/constatnts';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'report',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Report')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class ReportController {
  constructor(private reportService: ReportService) {}

  // API endpoint to generate the report
  // @Get('/generate')
  // async generateReport() {
  //   return await this.reportService.getDashboardData();
  // }

  @ApiOperation({
    description: 'Endpoint to get dashboard data based on months selected',
  })
  @ApiQuery({ name: 'period', enum: REPORT_PERIODS })
  @Get()
  getDashboardData(@Query('period', ParseIntPipe) period: number) {
    return this.reportService.getAll(period);
  }
}
