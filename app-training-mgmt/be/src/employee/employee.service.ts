import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmplyeeDto } from './dto/update-emplyee.dto';
import { RawActiveEmployeeRepository } from 'src/raw-data/employee-master/raw-active-employee.repository';
import { EmployeeStatus } from './employee-status.enum';
import { RawResignedEmployeeRepository } from 'src/raw-data/employee-master/raw-resigned-employee.repository';
import { ILike } from 'typeorm';
import { CreateRawEmployeeDto } from 'src/raw-data/employee-master/dto/create-raw-active-employee.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';
import { ConfigService } from '@nestjs/config';
import { BatchService } from 'src/batch/batch.service';
import { NO_DATA_MESSAGE } from 'src/core/constant/constatnts';
import { CACHE_TTL_ENV } from 'src/core/constant/env.constant';

@Injectable()
export class EmployeeService {
  private logger = new Logger(EmployeeService.name);
  constructor(
    private employeeRepository: EmployeeRepository,
    private rawActiveEmployeeRepo: RawActiveEmployeeRepository,
    private rawResignedEmployeeRepo: RawResignedEmployeeRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private batchService: BatchService,
  ) {}
  private CACHE_TTL = Number(this.configService.get<number>(CACHE_TTL_ENV));

  async createEmployee(
    createEmployeeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeRepository.createRecord(createEmployeeeDto);
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<PaginatedResponse> {
    return await this.employeeRepository.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      name,
    );
  }

  async getOne(id: string): Promise<Employee> {
    return await this.employeeRepository.getOneEmployee(id);
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmplyeeDto,
  ): Promise<Employee> {
    return await this.employeeRepository.updateEmployee(id, updateEmployeeDto);
  }

  async deleteEmployee(id: string): Promise<Employee> {
    return await this.employeeRepository.deleteEmployee(id);
  }

  async getActiveEmployees(): Promise<Employee[]> {
    const value: Employee[] = await this.cacheManager.get(
      CacheKeys.EMPLOYEE_ACTIVE,
    );
    if (value) {
      return value;
    } else {
      const res = await this.employeeRepository.activeEmployees();
      await this.cacheManager.set(
        CacheKeys.EMPLOYEE_ACTIVE,
        res,
        this.CACHE_TTL,
      );
      return res;
    }
  }

  async transferFromRawTable() {
    try {
      while (true) {
        const [tempActiveArray, tempResignedArray] = await Promise.all([
          this.processRawEmployees(
            this.rawActiveEmployeeRepo,
            EmployeeStatus.Active,
          ),
          this.processRawEmployees(
            this.rawResignedEmployeeRepo,
            EmployeeStatus.Resigned,
          ),
        ]);

        if (tempActiveArray.length === 0 && tempResignedArray.length === 0) {
          break;
        }
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmployeeService.name}/transferFromRawTable`,
      );
      console.error(error);
    }
  }

  async processRawEmployees(repo, status) {
    const rawEmployees = await repo.find({
      where: { isProcessed: false },
    });

    if (rawEmployees.length === 0) {
      this.logger.log(NO_DATA_MESSAGE);
      return [];
    }

    const tempArray = [];

    for (const emp of rawEmployees) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { id: emp.employeeNumber },
        order: { id: OrderValue.ASC },
      });

      if (existingEmployee) {
        // Check if any columns are different
        //const emp = this.mapRawEmployeeToDto(emp, status);
        const changedColumns = new UpdateEmplyeeDto();

        if (existingEmployee.name !== emp.employee) {
          changedColumns.name = emp.employee;
        }

        if (existingEmployee.email !== emp.email) {
          changedColumns.email = emp.email;
        }
        if (existingEmployee.doj !== emp.doj) {
          changedColumns.doj = emp.doj;
        }
        if (emp.reportingTo) {
          const reportingToEmployee = await this.employeeRepository.findOne({
            where: { name: ILike(`%${emp.reportingTo}%`) },
            order: { id: OrderValue.ASC },
          });
          if (reportingToEmployee) {
            if (existingEmployee.reportingTo !== reportingToEmployee.id) {
              changedColumns.reportingTo = reportingToEmployee.id;
            }
          } else {
            tempArray.push(emp);
          }
        }
        if (!existingEmployee.reportingTo) {
          const reportingToEmployee = await this.employeeRepository.findOne({
            where: { name: ILike(`%${emp.reportingTo}%`) },
            order: { id: OrderValue.ASC },
          });
          if (reportingToEmployee) {
            changedColumns.reportingTo = reportingToEmployee.id;
          } else {
            tempArray.push(emp);
          }
        }

        if (existingEmployee.currDesignation !== emp.currDesignation) {
          changedColumns.currDesignation = emp.currDesignation;
        }
        if (existingEmployee.currClient1 !== emp.currClient1) {
          changedColumns.currClient1 = emp.currClient1;
        }
        if (existingEmployee.currClient2 !== emp.currClient2) {
          changedColumns.currClient2 = emp.currClient2;
        }
        if (existingEmployee.currClient3 !== emp.currClient3) {
          changedColumns.currClient3 = emp.currClient3;
        }
        if (existingEmployee.currClient4 !== emp.currClient4) {
          changedColumns.currClient4 = emp.currClient4;
        }
        if (existingEmployee.coreTechStack !== emp.currCoreTechStack) {
          changedColumns.coreTechStack = emp.currCoreTechStack;
        }
        if (
          existingEmployee.secondaryTechStack !== emp.currSecondaryTechStack
        ) {
          changedColumns.secondaryTechStack = emp.currSecondaryTechStack;
        }
        if (existingEmployee.status != emp.employeeStatus) {
          changedColumns.status = emp.employeeStatus;
        }
        if (Object.keys(changedColumns).length > 0) {
          // Update the existing employee record
          await this.employeeRepository.updateEmployee(
            existingEmployee.id,
            changedColumns,
          );
          await repo.updateData(emp, { isProcessed: true });
        } else {
          await repo.updateData(emp, { isProcessed: true });
        }
      } else {
        if (emp.reportingTo === null) {
          const employeeDto = await this.mapRawEmployeeToDto(emp, status);
          await this.employeeRepository.createRecord(employeeDto);
          await repo.updateData(emp, { isProcessed: true });
        } else {
          const reportingToEmployee = await this.employeeRepository.findOne({
            where: { name: ILike(`%${emp.reportingTo}%`) },
            order: { id: OrderValue.ASC },
          });

          if (reportingToEmployee) {
            const employeeDto = await this.mapRawEmployeeToDto(
              emp,
              status,
              reportingToEmployee ? reportingToEmployee.id : null,
            );
            await this.employeeRepository.createRecord(employeeDto);
            await repo.updateData(emp, { isProcessed: true });
          } else {
            tempArray.push(emp);
          }
        }
      }
    }

    for (const emp of tempArray) {
      const reportingToEmployee = await this.employeeRepository.findOne({
        where: { name: ILike(`%${emp.reportingTo}%`) },
        order: { id: OrderValue.ASC },
      });

      if (reportingToEmployee) {
        const employeeDto = await this.mapRawEmployeeToDto(
          emp,
          status,
          reportingToEmployee ? reportingToEmployee.id : null,
        );

        await this.employeeRepository.createRecord(employeeDto);
        await repo.updateData(emp, { isProcessed: true });
      }
    }

    return tempArray;
  }

  async mapRawEmployeeToDto(emp: CreateRawEmployeeDto, status, reportingToId?) {
    return {
      id: emp.employeeNumber,
      name: emp.employee,
      email: emp.email,
      doj: emp.doj,
      reportingTo: reportingToId === null ? emp.reportingTo : reportingToId,
      currDesignation: emp.currDesignation,
      currClient1: emp.currClient1,
      currClient2: emp.currClient2,
      currClient3: emp.currClient3,
      currClient4: emp.currClient4,
      coreTechStack: emp.currCoreTechStack,
      secondaryTechStack: emp.currSecondaryTechStack,
      status: status,
    };
  }

  async getTrainingDetailsForEmployee(id: string): Promise<Employee> {
    return await this.employeeRepository.getTrainingDetailsForEmployee(id);
  }

  async getAllEmployeesForBatch(batchId: string) {
    if (batchId) {
      const batchIds: string[] = await this.batchService.getParentChildBatchIds(
        batchId,
      );
      return this.employeeRepository.getEmployeesForBatch(batchIds);
    }
  }
}
