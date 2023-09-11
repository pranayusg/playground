import { TrainingDashboard } from "./trainingDashboardInterface";

export interface PaginatedTrainingDashboard {
	records?: TrainingDashboard[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}