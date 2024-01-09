import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'employees',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Employees')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @ApiOperation({ description: 'Endpoint to get all Employees data' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set the no. of rows needs to be displayed.',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'name of the column by which you want to sort',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'asc / desc',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'get data based on the name',
  })
  @Get()
  getAllEmployees(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('name') name: string,
  ): Promise<PaginatedResponse> {
    return this.employeeService.getAll(page, noOfRecords, orderBy, order, name);
  }

  @ApiOperation({
    description: 'Endpoint to get all Employees whose status is Active',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @Get('active')
  getAllActiveEmployees(): Promise<Employee[]> {
    return this.employeeService.getActiveEmployees();
  }

  @ApiOperation({
    description:
      'Endpoint to get all Employees whose are present in given batch',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @Get('/:batchId')
  getAllEmployeesForBatch(@Param('batchId') batchId: string) {
    return this.employeeService.getAllEmployeesForBatch(batchId);
  }

  @ApiOperation({ description: 'Endpoint to get an employee by employee Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  getOneEmployee(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to fetch all training data for a single employee',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':empId/training-details')
  getTrainingDetailsForEmployee(
    @Param('empId') empId: string,
  ): Promise<Employee> {
    return this.employeeService.getTrainingDetailsForEmployee(empId);
  }
}
