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
import { Roles } from 'src/auth/roles.decorator';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { Role } from 'src/core/enum/role.enum';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CertificationAchievedService } from './certification-achieved/certification-achieved.service';
import { CreateCertificationAchievedDto } from './certification-achieved/dto/create-certification-achieved.dto';
import { UpdateCertificationAchievedDto } from './certification-achieved/dto/update-certification-achieved.dto';
import { CertificationAchieved } from './certification-achieved/entities/certification-achieved.entity';
import { CreateCertificationApprovedDto } from './certification-approved/dto/create-approved-certification.dto';
import { UpdateCertificationApprovedDto } from './certification-approved/dto/update-approved-certification.dto';
import { CertificationApproved } from './certification-approved/entities/certification-approved.entity';
import { CertificationApprovedService } from './certification-approved/certification-approved.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'certifications',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Certifications')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificationController {
  constructor(
    private certificationAchievedService: CertificationAchievedService,
    private approvedCertificaionService: CertificationApprovedService,
  ) {}

  @ApiOperation({ description: 'Endpoint to add a new Approved Certification' })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post('approved')
  AddCertificationApprovedData(
    @Body() createCertificationApprovedDto: CreateCertificationApprovedDto,
    @GetUser() user: IGetUser,
  ): Promise<CertificationApproved> {
    return this.approvedCertificaionService.createCertificationApproved(
      createCertificationApprovedDto,
      user,
    );
  }

  @ApiOperation({ description: 'Endpoint to get all certification data' })
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
    name: 'certificationName',
    required: false,
    description: 'get data based on the Certification Name',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    description: 'get data based on the level',
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('approved')
  getAllCertificationApproved(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('certificationName') certificationName: string,
    @Query('level') level: string,
  ): Promise<PaginatedResponse> {
    return this.approvedCertificaionService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      certificationName,
      level,
    );
  }

  @ApiOperation({ description: 'Endpoint to get a certification by Id' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('approved/:id')
  getOneCertificationApproved(
    @Param('id') id: string,
  ): Promise<CertificationApproved> {
    return this.approvedCertificaionService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a certification by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch('approved/:id')
  updateCertificationApprovedData(
    @Param('id') id: string,
    @Body() updateCertificationApprovedDto: UpdateCertificationApprovedDto,
    @GetUser() user: IGetUser,
  ): Promise<CertificationApproved> {
    return this.approvedCertificaionService.updateData(
      id,
      updateCertificationApprovedDto,
      user,
    );
  }

  @ApiOperation({
    description:
      'Endpoint to create a new record for Certification achieved by an employee',
  })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post('achieved')
  AddCertificationAchievedData(
    @Body() createCertificationAchieved: CreateCertificationAchievedDto,
    @GetUser() user: IGetUser,
  ): Promise<CertificationAchieved> {
    return this.certificationAchievedService.createCertificationAchieved(
      createCertificationAchieved,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to get all Certification achieved data',
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
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'get data based on the name',
  })
  @ApiQuery({
    name: 'certification',
    required: false,
    description: 'get data based on the certification',
  })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Get('achieved')
  getAllCertificationAchieved(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('name') name: string,
    @Query('certification') certification: string,
    @GetUser() user: IGetUser,
  ): Promise<PaginatedResponse> {
    return this.certificationAchievedService.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      name,
      certification,
      user,
    );
  }

  @ApiOperation({
    description: 'Endpoint to get a Certification achieved by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('achieved/:id')
  getOneCertificationAchieved(
    @Param('id') id: string,
  ): Promise<CertificationAchieved> {
    return this.certificationAchievedService.getOne(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a record by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch('achieved/:id')
  updateCertificationAchievedData(
    @Param('id') id: string,
    @Body() updateCertificationAchievedDto: UpdateCertificationAchievedDto,
    @GetUser() user: IGetUser,
  ): Promise<CertificationAchieved> {
    return this.certificationAchievedService.updateData(
      id,
      updateCertificationAchievedDto,
      user,
    );
  }
}
