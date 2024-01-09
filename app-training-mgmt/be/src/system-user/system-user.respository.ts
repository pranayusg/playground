import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SystemUser } from './entities/system-user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { UpdateSystemUserDto } from './dto/update-system-user.dto';
import * as bcrypt from 'bcrypt';
import { EmployeeStatus } from 'src/employee/employee-status.enum';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/core/enum/role.enum';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class SystemUserRepository extends Repository<SystemUser> {
  private logger = new Logger(SystemUserRepository.name);
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(SystemUser, dataSource.createEntityManager());
  }
  private salt = Number(this.configService.get<number>('SALT'));

  async createRecord(
    createSystemUserDto: CreateSystemUserDto,
  ): Promise<SystemUser> {
    try {
      const newRecord = this.create(createSystemUserDto);
      const result = this.save(newRecord);
      return result;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    role: string,
    name: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'emp.name';
      let queryBuilder = this.createQueryBuilder('entity').leftJoinAndSelect(
        'entity.username',
        'emp',
      );

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `${orderByValue}`,
          order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
        );
      } else {
        queryBuilder
          .orderBy(
            `${
              orderByValue === 'lastLoggedIn'
                ? 'entity.lastLoggedIn'
                : orderByValue
            }`,
            order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
          )
          .take(take)
          .skip(skip);
      }

      if (role) {
        queryBuilder = queryBuilder.andWhere('entity.type = :role', {
          role: role,
        });
      }

      if (name) {
        queryBuilder = queryBuilder.andWhere('emp.name ILIKE :name', {
          name: `%${name}%`,
        });
      }

      const [result, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / take);

      const restructuredResult = result.map((item: any) => ({
        username: { id: item.username.id, name: item.username.name },
        type: item.type,
        lastLoggedIn: item.lastLoggedIn,
      }));

      return {
        records: restructuredResult,
        totalRecords: total,
        totalPages,
        currentPage: Number(page),
      };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUser(username: string) {
    const query = this.createQueryBuilder('entity');
    const res = await query
      .where('entity.username = :username', { username: username })
      .leftJoinAndSelect('entity.username', 'user')
      .andWhere('user.status = :status', { status: EmployeeStatus.Active })
      .getOne();
    return res;
  }

  async getOneUserWithNoRelation(username: string): Promise<SystemUser> {
    const user = await this.findOne({ where: { username: username } });
    if (!user) {
      throw new NotFoundException(`User with Username: ${username} not found`);
    }
    return user;
  }

  async updatePassword(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ): Promise<SystemUser> {
    try {
      const { password } = updateSystemUserDto;
      const user = await this.getOneUserWithNoRelation(username);

      const hashedPassword = await bcrypt.hash(password, this.salt);
      user.password = hashedPassword;
      const updatedCred = this.save(user);
      return updatedCred;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/updatePassword`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateData(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ): Promise<SystemUser> {
    const user = await this.findUser(username);
    try {
      const updateUser = Object.assign(user, updateSystemUserDto);
      const updatedUser = await this.save(updateUser);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async setPassword(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
    type: Role,
  ): Promise<SystemUser> {
    try {
      const tempPassword = updateSystemUserDto.password;
      const password = await bcrypt.hash(tempPassword, this.salt);
      const res = await this.createRecord({ username, password, type });
      return res;
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException(
          `Account already exists for username: ${username}`,
        );
      }
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/setPassword`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async reSetPassword(
    username: string,
    updateSystemUserDto: UpdateSystemUserDto,
  ): Promise<SystemUser> {
    try {
      const tempPassword = updateSystemUserDto.password;
      const password = await bcrypt.hash(tempPassword, this.salt);
      const res = await this.updateData(username, { password });
      return res;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${SystemUserRepository.name}/reSetPassword`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLoggedInUserInfo(empId: string) {
    const user: any = await this.findUser(empId);
    return {
      username: { id: user.username.id, name: user.username.name },
      type: user.type,
      state: user.state,
    };
  }
}
