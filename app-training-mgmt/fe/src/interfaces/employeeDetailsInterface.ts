import { Batch } from './batchInterface';
import { Certification } from './certificationInterface';

export interface EmployeeDetailsInterface {
	name: string;
	id: string;
	email: string;
	doj: Date;
	reportingTo: string;
	currDesignation: string;
	currClient1: string;
	currClient2: string;
	currClient3: string;
	currClient4: string;
	coreTechStack: string;
	secondaryTechStack: Date;
	status: string;
	trainingDetail: Batch[];
	certificationAchieved: Certification[];
	certificationOngoing: Certification[];
}
