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
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { Tech } from './entities/tech.entity';
import { TechService } from './tech.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import { UpdateTechTrainingDto } from 'src/tech/dto/update-tech-training.dto';
import { CreateTechTrainingDto } from 'src/tech/dto/create-tech-training.dto';
import { TechTraining } from 'src/tech/entities/tech_training.entity';
import { TechTrainingService } from 'src/tech/tech-training.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { IGetUser } from 'src/auth/get-user.interface';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'tech',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Tech')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class TechController {
  constructor(
    private techService: TechService,
    private techTrainingService: TechTrainingService,
  ) {}

  @ApiOperation({ description: 'Endpoint to add a new tech' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  AddData(
    @Body() createTechDto: CreateTechDto,
    @GetUser() user: IGetUser,
  ): Promise<Tech> {
    return this.techService.createTech(createTechDto, user);
  }

  @ApiOperation({ description: 'Endpoint to get all tech data' })
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
    description: 'get data based on the tech Name',
  })
  @Get()
  getAll(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('name') name: string,
  ): Promise<PaginatedResponse> {
    return this.techService.getAll(page, noOfRecords, orderBy, order, name);
  }

  @ApiOperation({
    description: 'Endpoint to update a tech by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  updateData(
    @Param('id') id: string,
    @Body() updateTechDto: UpdateTechDto,
    @GetUser() user: IGetUser,
  ): Promise<Tech> {
    return this.techService.updateData(id, updateTechDto, user);
  }

  @ApiOperation({ description: 'Endpoint to add a new Tech Training' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post('training')
  AddTechTrainingData(
    @Body() createTechTrainingDto: CreateTechTrainingDto,
    @GetUser() user: IGetUser,
  ): Promise<TechTraining> {
    return this.techTrainingService.createTechTraining(
      createTechTrainingDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all Tech Training data' })
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
    name: 'tech',
    required: false,
    description: 'get data based on the tech Name',
  })
  @ApiQuery({
    name: 'topic',
    required: false,
    description: 'get data based on the topic',
  })
  @Get('training')
  getAllTechTraining(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('tech') tech: string,
    @Query('topic') topic: string,
  ): Promise<PaginatedResponse> {
    return this.techTrainingService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      tech,
      topic,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a Tech Training by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('training/:id')
  getOneTechTraining(@Param('id') id: string): Promise<TechTraining> {
    return this.techTrainingService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a Tech Training by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('training/:id')
  updateTechTrainingData(
    @Param('id') id: string,
    @Body() updateTechTrainingDto: UpdateTechTrainingDto,
    @GetUser() user: IGetUser,
  ): Promise<TechTraining> {
    return this.techTrainingService.updateData(id, updateTechTrainingDto, user);
  }

  @ApiOperation({ description: 'Endpoint to get a tech by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Tech> {
    return this.techService.getOne(id);
  }
}
