export interface Batch {
	id: string;
	batchTitle: string;
	tech: string;
	startDate: Date;
	endDate: Date | null;
	trainingCoordinator: string;
	headTrainer: string;
	NoOfTrainees: number | null;
	NoSuccess: number | null;
	NoFailed: number | null;
	status: string;
	isProcessed: boolean;
	createdAt: Date;
	updatedAt: Date;
}