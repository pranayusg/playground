import { JobDetails } from "./jobDetailsInterface";

export interface PaginatedJobDetails {
	records?: JobDetails[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}