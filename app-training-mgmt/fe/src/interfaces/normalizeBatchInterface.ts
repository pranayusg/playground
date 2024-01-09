import { Tech } from './assignmnetInterface';

export type NormalizedBatchInterface = {
	id?: string;
	batchTitle: string;
	endDate: string;
	headTrainer: string;
	parent?: {
		id: string;
		batchTitle: string;
		endDate: string;
		headTrainer: string;
		parent?: NormalizedBatchInterface;
		startDate: string;
		status: string;
		techTopic: string;
		trainingCoordinator: string;
		description: string;
		feedbackComment: string;
		averageRatingsByTrainees: string;
		noOfTrainees: number | null;
	};
	startDate: string;
	status: string;
	techTopic: string;
	trainingCoordinator: string;
	description?: string;
	feedbackComment?: string;
	averageRatingsByTrainees?: string;
	noOfTrainees?: number | null;
	techId?: Tech;
	createdAt?: Date;
	updatedAt?: Date;
};
