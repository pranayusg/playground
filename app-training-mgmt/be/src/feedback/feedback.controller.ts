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
import { GetUser } from 'src/auth/get-user.decorator';
import { IGetUser } from 'src/auth/get-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { Role } from 'src/core/enum/role.enum';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { AssignmentStatus } from './feedback-assignment/assignment-status.enum';
import { CreateFeedbackAssignmentDto } from './feedback-assignment/dto/create-feedback-assignment.dto';
import { UpdateFeedbackAssignmentDto } from './feedback-assignment/dto/update-feedback-assignment.dto';
import { FeedbackAssignment } from './feedback-assignment/entities/feedback-assignment.entity';
import { FeedbackAssignmentService } from './feedback-assignment/feedback-assignment.service';
import { CreateAllFeedbackTraineesBatchDto } from './feedback-trainees-batch/dto/create-all-feedback-trainees-batch.dto';
import { GenerateFormDto } from './feedback-trainees-batch/dto/generate-form.dto';
import { UpdateFeedbackTraineesBatchDto } from './feedback-trainees-batch/dto/update-feedback-trainees-batch.dto';
import { FeedbackTraineesBatch } from './feedback-trainees-batch/entities/feedback-trainees-batch.entity';
import { FeedbackTraineesBatchService } from './feedback-trainees-batch/feedback-trainees-batch.service';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'feedback',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Feedback')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(
    private feedbackAssignmentService: FeedbackAssignmentService,
    private feedbackTraineesBatchService: FeedbackTraineesBatchService,
  ) {}

  @ApiOperation({ description: 'Endpoint to add a new assignment comment' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post('assignment')
  AddFeedbackAssignmentData(
    @Body() createFeedbackAssignmentDto: CreateFeedbackAssignmentDto,
    @GetUser() user: IGetUser,
  ): Promise<FeedbackAssignment> {
    return this.feedbackAssignmentService.createFeedbackAssignment(
      createFeedbackAssignmentDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all assignment comment data' })
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
    name: 'employee',
    required: false,
    description: 'get data based on the employee name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'get data based on the status',
    enum: AssignmentStatus,
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get('assignment')
  getAllFeedbackAssignment(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('employee') employee: string,
    @Query('status') status: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.feedbackAssignmentService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      employee,
      status,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get an assignment comment by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('assignment/:id')
  getOneFeedbackAssignment(
    @Param('id') id: string,
  ): Promise<FeedbackAssignment> {
    return this.feedbackAssignmentService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update an assignment comment by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch('assignment/:id')
  updateFeedbackAssignmentData(
    @Param('id') id: string,
    @Body() updateFeedbackAssignmentDto: UpdateFeedbackAssignmentDto,
    @GetUser() user: IGetUser,
  ): Promise<FeedbackAssignment> {
    return this.feedbackAssignmentService.updateData(
      id,
      updateFeedbackAssignmentDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to add a new FeedbackTraineesBatch' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Post('trainees-batch')
  AddFeedbackTraineesBatchData(
    @Body()
    createAllFeedbackTraineesBatchDto: CreateAllFeedbackTraineesBatchDto,
    @GetUser() user: IGetUser,
  ): Promise<FeedbackTraineesBatch[]> {
    return this.feedbackTraineesBatchService.createFeedbackTraineesBatch(
      createAllFeedbackTraineesBatchDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all FeedbackTraineesBatchs' })
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
    name: 'batchId',
    required: false,
    description:
      'get data based on the batchId. If its parent batchId then it will give all its children batches data. Or if its has no child then its data.',
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get('trainees-batch')
  getAllFeedbackTraineesBatch(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('batchId') batchId: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.feedbackTraineesBatchService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      batchId,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to get a FeedbackTraineesBatch by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('trainees-batch/:id')
  getOneFeedbackTraineesBatch(
    @Param('id') id: string,
  ): Promise<FeedbackTraineesBatch> {
    return this.feedbackTraineesBatchService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a FeedbackTraineesBatch by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch('trainees-batch/:id')
  updateFeedbackTraineesBatchData(
    @Param('id') id: string,
    @Body() updateFeedbackTraineesBatchDto: UpdateFeedbackTraineesBatchDto,
    @GetUser() user: IGetUser,
  ): Promise<FeedbackTraineesBatch> {
    return this.feedbackTraineesBatchService.updateData(
      id,
      updateFeedbackTraineesBatchDto,
      user,
    );
  }

  @ApiOperation({
    description:
      'Endpoint to generate link and send email to trainees to send feedback for the session',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post('trainees-batch/send-feedback/:batchId')
  GenerateLink(
    @Param('batchId') batchId: string,
    @Body() generateFormDto: GenerateFormDto,
  ) {
    return this.feedbackTraineesBatchService.sendFeedbackEmail(
      batchId,
      generateFormDto,
    );
  }
}
