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
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { QuestionOptionService } from './question-option.service';
import { QuestionOption } from './entities/question-option.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'option',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Option')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
export class QuestionOptionController {
  constructor(private questionOptionService: QuestionOptionService) {}

  @ApiOperation({ description: 'Endpoint to add a new Option' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  AddData(@Body() createOptionDto: CreateOptionDto): Promise<QuestionOption> {
    return this.questionOptionService.createOption(createOptionDto);
  }

  @ApiOperation({ description: 'Endpoint to get all Options' })
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
    name: 'Option',
    required: false,
    description: 'get data based on the Option Name',
  })
  @Get()
  getAll(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('Option') Option: string,
  ): Promise<PaginatedResponse> {
    return this.questionOptionService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      Option,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a Option by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<QuestionOption> {
    return this.questionOptionService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a Option by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  updateData(
    @Param('id') id: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ): Promise<QuestionOption> {
    return this.questionOptionService.updateData(id, updateOptionDto);
  }
}
