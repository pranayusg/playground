import { Employee } from './employeeInterface';

export interface PaginatedEmployees {
	records?: Employee[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}
