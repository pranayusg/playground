import { NormalizedEmployeeInterface } from './normalizedEmployeeInterface';

export interface NormalizedApprovedCertificationInterface {
	id?: string;
	certificationName?: string;
	tech?: string;
	level?: string;
	costInDollars?: number | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface NormalizedAchievedCertificationInterface {
	empId?: NormalizedEmployeeInterface;
	exam?: NormalizedApprovedCertificationInterface;
	achievedDate?: Date | null;
	expiryDate?: Date | null;
	certificationLink?: string;
}
