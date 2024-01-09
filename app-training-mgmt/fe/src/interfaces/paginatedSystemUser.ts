import { SystemUsersState } from './systemUserInterface';

export interface PaginatedSystemUser {
	records?: SystemUsersState[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}
