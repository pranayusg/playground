import { Injectable } from '@nestjs/common';
import { SystemUserRepository } from './system-user.respository';
import { UpdateSystemUserDto } from './dto/update-system-user.dto';
import { SystemUser } from './entities/system-user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/core/enum/role.enum';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { ADMIN_ID_ENV } from 'src/core/constant/env.constant';

@Injectable()
export class SystemUserService {
  constructor(
    private systemUserRepository: SystemUserRepository,
    private configService: ConfigService,
  ) {}
  private ADMINS = this.configService.get<string>(ADMIN_ID_ENV);

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    role: string,
    name: string,
  ): Promise<PaginatedResponse> {
    return this.systemUserRepository.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      role,
      name,
    );
  }
  async findOne(username: string) {
    return this.systemUserRepository.findUser(username);
  }

  async getOnewithNoRelation(username: string): Promise<SystemUser> {
    return await this.systemUserRepository.getOneUserWithNoRelation(username);
  }

  async setPassword(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ) {
    let type: Role;
    const adminIds = this.ADMINS.split(',');
    const admin = adminIds.filter((id) => id === username);
    if (admin.length === 1) {
      type = Role.ADMIN;
    } else {
      type = Role.TRAINEE;
    }
    return await this.systemUserRepository.setPassword(
      username,
      updateSystemUserDto,
      type,
    );
  }

  async reSetPassword(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ) {
    return await this.systemUserRepository.reSetPassword(
      username,
      updateSystemUserDto,
    );
  }

  async getLoggedInUserInfo(empId: string) {
    return await this.systemUserRepository.getLoggedInUserInfo(empId);
  }

  updateData(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ): Promise<SystemUser> {
    return this.systemUserRepository.updateData(username, updateSystemUserDto);
  }
}
