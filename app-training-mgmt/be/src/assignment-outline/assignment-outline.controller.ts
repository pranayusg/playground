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
import { AssignmentOutlineService } from './assignment-outline.service';
import { AssignmentOutline } from './entities/assignment-outline.entity';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { CreateAssignmentOutlineDto } from './dto/create-assignment-outline.dto';
import { UpdateAssignmentOutlineDto } from './dto/update-assignment-outline.dto';
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
  path: 'assignment-outline',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Assignment Outline')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class AssignmentOutlineController {
  constructor(private assignmentOutlineService: AssignmentOutlineService) {}

  @ApiOperation({ description: 'Endpoint to add a new assignment outline' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  AddData(
    @Body() createAssignmentOutlineDto: CreateAssignmentOutlineDto,
    @GetUser() user: IGetUser,
  ): Promise<AssignmentOutline> {
    return this.assignmentOutlineService.createAssignmentOutline(
      createAssignmentOutlineDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all assignment outline data' })
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
    name: 'topic',
    required: false,
    description: 'get data based on the topic',
  })
  @ApiQuery({
    name: 'tech',
    required: false,
    description: 'get data based on the tech',
  })
  @Get()
  getAll(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('topic') topic: string,
    @Query('tech') tech: string,
  ): Promise<PaginatedResponse> {
    return this.assignmentOutlineService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      topic,
      tech,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a assignment outline by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<AssignmentOutline> {
    return this.assignmentOutlineService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a assignment outline by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  updateData(
    @Param('id') id: string,
    @Body() updateAssignmentOutlineDto: UpdateAssignmentOutlineDto,
    @GetUser() user: IGetUser,
  ): Promise<AssignmentOutline> {
    return this.assignmentOutlineService.updateData(
      id,
      updateAssignmentOutlineDto,
      user,
    );
  }
}
