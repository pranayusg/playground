export interface Batch {
	id: string;
	batchTitle: string;
	tech: string;
	startDate: Date;
	endDate: Date | null;
	trainingCoordinator: string;
	headTrainer: string;
	noOfTrainees: number | null;
	noSuccess: number | null;
	noFailed: number | null;
	status: string;
	isProcessed: boolean;
	createdAt: Date;
	updatedAt: Date;
}
