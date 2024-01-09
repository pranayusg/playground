import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { CreateEvaluationCriteriaDto } from './dto/create-evaluation-criteria.dto';
import { UpdateEvaluationCriteriaDto } from './dto/update-evaluation-criteria.dto';
import { EvaluationCriteria } from './entities/evaluation-criteria.entity';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { IGetUser } from 'src/auth/get-user.interface';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'evaluation-criteria',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Evaluation Criteria')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard)
export class EvaluationCriteriaController {
  constructor(private evaluationCriteriaService: EvaluationCriteriaService) {}

  @ApiOperation({ description: 'Endpoint to add a new Evaluation Criteria' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  AddData(
    @Body() createEvaluationCriteriaDto: CreateEvaluationCriteriaDto,
    @GetUser() user: IGetUser,
  ): Promise<EvaluationCriteria> {
    return this.evaluationCriteriaService.createEvaluationCriteria(
      createEvaluationCriteriaDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all Evaluation Criterias' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get()
  getAll(): Promise<PaginatedResponse> {
    return this.evaluationCriteriaService.getAll();
  }

  @ApiOperation({ description: 'Endpoint to get a Evaluation Criteria by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<EvaluationCriteria> {
    return this.evaluationCriteriaService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a Evaluation Criteria by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  updateData(
    @Param('id') id: string,
    @Body() updateEvaluationCriteriaDto: UpdateEvaluationCriteriaDto,
    @GetUser() user: IGetUser,
  ): Promise<EvaluationCriteria> {
    return this.evaluationCriteriaService.updateData(
      id,
      updateEvaluationCriteriaDto,
      user,
    );
  }
}
