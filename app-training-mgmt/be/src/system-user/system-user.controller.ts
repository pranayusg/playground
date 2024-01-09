import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { SystemUserService } from './system-user.service';
import { UpdateSystemUserDto } from './dto/update-system-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'system-users',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('System Users')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemUserController {
  constructor(private systemUserService: SystemUserService) {}

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
    name: 'role',
    type: 'enum',
    required: false,
    description: 'get data based on the role',
    enum: Role,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'get data based on the name',
  })
  @Roles(Role.ADMIN)
  @Get()
  getAll(
    @Query('pageNo') pageNo: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('role') role: string,
    @Query('name') name: string,
  ): Promise<PaginatedResponse> {
    return this.systemUserService.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      role,
      name,
    );
  }

  @Roles(Role.ADMIN, Role.TRAINEE, Role.TRAINER)
  @Get('/:empId/details')
  getStateForUser(@Param('empId') empId: string) {
    return this.systemUserService.getLoggedInUserInfo(empId);
    //return this.systemUserService.findOne(empId);
  }

  @ApiBody({ schema: { example: { state: {} } } })
  @Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)
  @Patch('/:empId/state')
  async updateStateForUser(
    @Param('empId') empId: string,
    @Body() updateSystemUserDto: UpdateSystemUserDto,
  ) {
    if (!updateSystemUserDto.type) {
      await this.systemUserService.updateData(empId, updateSystemUserDto);
      return { message: `State for username : ${empId} saved` };
    } else {
      throw new BadRequestException(`Cannot update type(role) from this route`);
    }
  }

  @ApiBody({ schema: { example: { type: 'string' } } })
  @Roles(Role.ADMIN)
  @Patch('/:empId/role')
  updateRole(
    @Param('empId') empId: string,
    @Body() updateSystemUserDto: UpdateSystemUserDto,
  ) {
    try {
      this.systemUserService.updateData(empId, updateSystemUserDto);
      return { message: `Role for username : ${empId} updated` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
