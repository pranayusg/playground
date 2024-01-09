import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { BatchService } from './batch.service';
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
import { CreateBatchDto } from './dto/create-batch.dto';
import { Batch } from './entities/batch.entity';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { IGetUser } from 'src/auth/get-user.interface';
import { CreateBatchAssignmentOutlineDto } from 'src/batch/dto/create-batch-assignment-outline.dto';
import { UpdateBatchAssignmentOutlineDto } from 'src/batch/dto/update-batch-assignment-outline.dto';
import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';
import { BatchAssignmentOutlineService } from 'src/batch/batch-assignment-outline.service';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'batches',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Batches')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchController {
  constructor(
    private batchService: BatchService,
    private batchAssignmentOutlineService: BatchAssignmentOutlineService,
  ) {}

  @ApiOperation({ description: 'Endpoint to create a new Batch' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  createBatch(
    @Body() createBatchDto: CreateBatchDto,
    @GetUser() user: IGetUser,
  ): Promise<Batch> {
    return this.batchService.createBatch(createBatchDto, user);
  }

  @ApiOperation({ description: 'Endpoint to get all Batches data' })
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
    name: 'status',
    required: false,
    description: 'get data based on the status',
  })
  @ApiQuery({
    name: 'tech',
    required: false,
    description: 'get data based on the tech',
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get()
  getAll(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('status') status: string,
    @Query('tech') tech: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.batchService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      status,
      tech,
      user,
    );
  }

  @ApiOperation({
    description: 'endpoint to get all the tech from the batch table.',
  })
  @ApiOkResponse({
    description: SwaggerConstant.OkRes,
  })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    description:
      'Sort of flag to identiy if filter based on logged in user is required or not',
    type: 'boolean',
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get('/tech')
  getTech(@Query('trainer') trainer: boolean, @GetUser() user: IGetUser) {
    return this.batchService.getTech(trainer, user);
  }

  @ApiOperation({
    description: 'endpoint to get all the status from the batch table.',
  })
  @ApiOkResponse({
    description: SwaggerConstant.OkRes,
  })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get('/status')
  getStatus() {
    return this.batchService.getStatus();
  }

  @ApiOperation({
    description: 'endpoint to get only the parent batches.',
  })
  @ApiOkResponse({
    description: SwaggerConstant.OkRes,
  })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    description:
      'Sort of flag to identiy if filter based on logged in user is required or not',
    type: 'boolean',
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('/parent')
  getParentBatches(
    @Query('trainer') trainer: boolean,
    @GetUser() user: IGetUser,
  ): Promise<Batch[]> {
    return this.batchService.getParentBatches(trainer, user);
  }

  @ApiOperation({
    description: 'endpoint to get batches with tree structre.',
  })
  @ApiOkResponse({
    description: SwaggerConstant.OkRes,
  })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    type: 'boolean',
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('/tree')
  getBatchesAsTree(
    @Query('trainer') trainer: boolean,
    @GetUser() user: IGetUser,
  ): Promise<Batch[]> {
    return this.batchService.getBatchesAsTree(trainer, user);
  }

  @ApiOperation({
    description: 'Endpoint to update a Batch by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
    @GetUser() user: IGetUser,
  ): Promise<Batch> {
    return this.batchService.updateData(id, updateBatchDto, user);
  }

  @ApiOperation({
    description: 'Endpoint to add a new Batch Assignment Outline',
  })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post('assignment-outline')
  AddBatchAssignmentOutlineData(
    @Body() createBatchAssignmentOutlineDto: CreateBatchAssignmentOutlineDto,
    @GetUser() user: IGetUser,
  ): Promise<BatchAssignmentOutline> {
    return this.batchAssignmentOutlineService.createBatchAssignmentOutline(
      createBatchAssignmentOutlineDto,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to get all Batch Assignment Outline data',
  })
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
  @Get('assignment-outline')
  getAllBatchAssignmentOutline(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.batchAssignmentOutlineService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to get a Batch Assignment Outline by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('assignment-outline/:id')
  getOneBatchAssignmentOutline(
    @Param('id') id: string,
  ): Promise<BatchAssignmentOutline> {
    return this.batchAssignmentOutlineService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a Batch Assignment Outline by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('assignment-outline/:id')
  updateBatchAssignmentOutlineData(
    @Param('id') id: string,
    @Body() updateBatchAssignmentOutlineDto: UpdateBatchAssignmentOutlineDto,
    @GetUser() user: IGetUser,
  ): Promise<BatchAssignmentOutline> {
    return this.batchAssignmentOutlineService.updateData(
      id,
      updateBatchAssignmentOutlineDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a Batch by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Batch> {
    return this.batchService.getOne(id);
  }
}
