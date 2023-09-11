import { Batch } from "./batchInterface";

export interface PaginatedBatches {
	records?: Batch[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}