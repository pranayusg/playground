export type AssignmentInterface = {
	id?: string;
	assignmentTopic: string;
	endDate: string;
	headTrainer: string;
	startDate: string;
	tech: string;
	techTopic: string;
	trainingCoordinator: string;
	description: string;
	feedbackComment: string;
	link: string;
	duration: number | null;
	createdAt?: Date;
	updatedAt?: Date;
};
