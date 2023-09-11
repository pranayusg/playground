export interface TrainingDashboard {
	empId: string;
	name: string;
	designation: string;
	reportingManager: string;
	clientDirector: string;
	clientName: string;
	resourceType: string;
	doj: Date;
	trainer: string;
	typeOfTraining: string;
	batchType: string;
	batchTypeDescription: string;
	trainingStartDate: Date;
	trainingEndDate: Date;
	batchStatus: string;
	employeeStatus: string;
	isProcessed: boolean;
	createdAt: Date;
	updatedAt: Date;
}