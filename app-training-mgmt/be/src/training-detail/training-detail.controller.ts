import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { TrainingDetailService } from './training-detail.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { TrainingDetail } from './entities/training-detail.entity';
import { CreateTrainingDetailDto } from './dto/create-training-detail.dto';
import { UpdateTrainingDetailDto } from './dto/update-training-detail.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { IGetUser } from 'src/auth/get-user.interface';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'training-details',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Training Details')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class TrainingDetailController {
  constructor(private trainingDetailService: TrainingDetailService) {}

  @ApiOperation({ description: 'Endpoint to create a new Training detail' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  createTrainingDetail(
    @Body() createTrainingDetailDto: CreateTrainingDetailDto,
    @GetUser() user: IGetUser,
  ): Promise<TrainingDetail> {
    return this.trainingDetailService.createTrainingDetail(
      createTrainingDetailDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all Training Detail data' })
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
    name: 'employeeID',
    description: 'To fetch all training data for a single employee',
    required: false,
  })
  @ApiQuery({
    name: 'supervisorId',
    description:
      'To fetch all training data for all employees under the supervisor',
    required: false,
  })
  @ApiQuery({
    name: 'clientName',
    description:
      'To fetch all training data for all employees for a client team',
    required: false,
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
    name: 'batchStatus',
    required: false,
    description: 'get data based on the batchStatus',
  })
  @Get()
  getAll(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('employeeID') empId: string,
    @Query('supervisorId') supId: string,
    @Query('clientName') clientName: string,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('batchStatus') batchStatus: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.trainingDetailService.getAll(
      page,
      noOfRecords,
      empId,
      supId,
      clientName,
      orderBy,
      order,
      user,
      batchStatus,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a Training Detail by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<TrainingDetail> {
    return this.trainingDetailService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a Training Detail by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingDetailDto: UpdateTrainingDetailDto,
    @GetUser() user: IGetUser,
  ): Promise<TrainingDetail> {
    return this.trainingDetailService.updateData(
      id,
      updateTrainingDetailDto,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to delete a Training Detail by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<TrainingDetail> {
    return this.trainingDetailService.deleteData(id);
  }
}
