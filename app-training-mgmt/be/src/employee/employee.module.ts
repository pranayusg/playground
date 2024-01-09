import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';
import { RawActiveEmployeeRepository } from 'src/raw-data/employee-master/raw-active-employee.repository';
import { RawResignedEmployeeRepository } from 'src/raw-data/employee-master/raw-resigned-employee.repository';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), BatchModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeeRepository,
    RawActiveEmployeeRepository,
    RawResignedEmployeeRepository,
  ],
  exports: [
    EmployeeService,
    EmployeeRepository,
    RawActiveEmployeeRepository,
    RawResignedEmployeeRepository,
  ],
})
export class EmployeeModule {}
