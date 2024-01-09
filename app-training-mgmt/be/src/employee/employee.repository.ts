import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmplyeeDto } from './dto/update-emplyee.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { EmployeeStatus } from './employee-status.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  private logger = new Logger(EmployeeRepository.name);
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(Employee, dataSource.createEntityManager());
  }

  async createRecord(createEmployeeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const newUser = this.create(createEmployeeeDto);
      const createdEmployee = await this.save(newUser);

      return createdEmployee;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      await this.cacheManager.del(CacheKeys.EMPLOYEE_ACTIVE);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'id';

      let queryBuilder = this.createQueryBuilder('entity');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `entity.${orderByValue}`,
          order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
        );
      } else {
        queryBuilder
          .orderBy(
            `entity.${orderByValue}`,
            order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
          )
          .take(take)
          .skip(skip);
      }

      if (name) {
        queryBuilder = queryBuilder.where('entity.name ILIKE :name', {
          name: `%${name}%`,
        });
      }

      if (pageNo == 0) {
        const res = await queryBuilder.getMany();
        return { records: res };
      }

      const [result, total] = await queryBuilder.getManyAndCount();
      await this.replaceReportingToObjects(result);

      const totalPages = Math.ceil(total / take);

      return {
        records: result,
        totalRecords: total,
        totalPages,
        currentPage: Number(page),
      };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async replaceReportingToObjects(employees: Employee | Employee[]) {
    try {
      // Ensure employees is an array
      const employeeArray = Array.isArray(employees) ? employees : [employees];

      // Extract all reportingTo IDs
      const reportingToIds = employeeArray.map(
        (employee) => employee.reportingTo,
      );

      // Remove duplicate IDs
      const uniqueReportingToIds = [...new Set(reportingToIds)];

      // Fetch corresponding reportingTo objects from the database
      const reportingToObjects = await this.createQueryBuilder('entity')
        .whereInIds(uniqueReportingToIds)
        .getMany();

      // Create a mapping of ID to corresponding object
      const reportingToMap = reportingToObjects.reduce((map, obj) => {
        map[obj.id] = obj;
        return map;
      }, {});

      // Replace reportingTo with corresponding object in each employee
      employeeArray.forEach((employee) => {
        employee.reportingTo = reportingToMap[employee.reportingTo];
      });

      // If the input was a single employee, return the modified object
      if (!Array.isArray(employees)) {
        return employeeArray[0];
      }

      // If the input was an array, return the modified array
      return employeeArray;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/replaceReportingToObjects`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneEmployee(id: string): Promise<Employee> {
    const employee = await this.findOne({
      where: { id: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID: ${id} not found`);
    }

    return employee;
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmplyeeDto) {
    try {
      const user = await this.getOneEmployee(id);
      const updateUser = Object.assign(user, updateEmployeeDto);
      const updatedUser = await this.save(updateUser);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/updateEmployee`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      await this.cacheManager.del(CacheKeys.EMPLOYEE_ACTIVE);
    }
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const employee = await this.getOneEmployee(id);
    try {
      await this.delete(employee);
      return employee;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/updateEmployee`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTrainingDetailsForEmployee(id: string): Promise<Employee> {
    const query = this.createQueryBuilder('employee');
    const employee = await query
      .leftJoinAndSelect('employee.trainingDetail', 'trainingDetail')
      .leftJoinAndSelect('trainingDetail.batchId', 'batch')
      .leftJoinAndSelect('employee.certificationAchieved', 'achieved')
      .leftJoinAndSelect('achieved.exam', 'exam')
      .leftJoinAndSelect('employee.certificationOngoing', 'ongoing')
      .leftJoinAndSelect('ongoing.exam', 'ongoingExam')
      .where('employee.id = :id', { id: id })
      .getOne();
    await this.replaceReportingToObjects(employee);

    if (!employee) {
      throw new NotFoundException(`Employee with ID: ${id} not found`);
    }

    return employee;
  }

  async activeEmployees(): Promise<Employee[]> {
    try {
      const employees = this.find({
        where: { status: EmployeeStatus.Active },
        order: { name: OrderValue.ASC },
      });
      return employees;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/activeEmployee`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getEmployeesForBatch(batchIds: string[]): Promise<Employee[]> {
    try {
      const query = this.createQueryBuilder('employee');
      const employees = await query
        .leftJoin('employee.trainingDetail', 'trainingDetail')
        .leftJoin('trainingDetail.batchId', 'batch')
        .andWhere('batch.id IN (:...batchIds)', { batchIds })
        .getMany();
      return employees;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeRepository.name}/getEmployeesForBatch`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
