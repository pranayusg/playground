import { Summary } from "./summaryInterface";

export interface JobDetails {
	jobId: string;
	fileName: string;
	status: string;
	filePath: string;
	summary: Summary[];
	jobType: string;
	importType: string;
	createdAt: Date;
	updatedAt: Date;
}