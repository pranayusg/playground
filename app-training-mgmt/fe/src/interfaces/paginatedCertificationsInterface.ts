import { Certification } from './certificationInterface';

export interface PaginatedCertifications {
	records?: Certification[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}
