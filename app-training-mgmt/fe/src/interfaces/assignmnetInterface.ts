export interface Tech {
	id?: string;
	name: string;
	parent?: Tech;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PaginatedTech {
	records?: Tech[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}

export interface TechTraining {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	topic: string;
	description: string;
	level: string;
	techId: Tech;
}

export interface PaginatedTechTraining {
	records?: TechTraining[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}

export interface AssignmentOutline {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	techTrainingId: TechTraining;
	topic: string;
	duration: number;
	link: string;
	ratingKeys: {};
}

export interface PaginatedAssignmentOutline {
	records?: AssignmentOutline[];
	totalRecords?: number;
	totalPages?: number;
	currentPage?: number;
}
