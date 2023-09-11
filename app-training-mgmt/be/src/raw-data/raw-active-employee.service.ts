import { Injectable } from '@nestjs/common';
import { RawActiveEmployeeRepository } from './raw-active-employee.repository';
import { CreateRawActiveEmployeeDto } from './dto/create-raw-active-employee.dto';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class RawActiveEmployeeService {
  constructor(private rawActiveEmployeeRepo: RawActiveEmployeeRepository) {}

  createEntry(newData: CreateRawActiveEmployeeDto) {
    return this.rawActiveEmployeeRepo.createNewEntry(newData);
  }

  getAll(
    page: number,
    noOfRecords: number,
    name: string,
  ): Promise<PaginatedResponse> {
    return this.rawActiveEmployeeRepo.getAll(page, noOfRecords, name);
  }
}
