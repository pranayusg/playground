import { Injectable } from '@nestjs/common';
import { RawResignedEmployeeRepository } from './raw-resigned-employee.repository';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class RawResignedEmployeeService {
  constructor(private rawResignedEmployeeRepo: RawResignedEmployeeRepository) {}

  getAll(
    page: number,
    noOfRecords: number,
    name: string,
  ): Promise<PaginatedResponse> {
    return this.rawResignedEmployeeRepo.getAll(page, noOfRecords, name);
  }
}
