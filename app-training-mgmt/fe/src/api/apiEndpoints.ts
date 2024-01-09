import axios from 'axios';
import { env } from '../env';

const baseUrl = env.REACT_APP_API_BASE_URL;
const API_HEADER = env.REACT_APP_API_VERSIONING_HEADER;
const API_VERSION = env.REACT_APP_API_VERSION;

const api = axios.create({
	baseURL: baseUrl,
	headers: { [API_HEADER]: API_VERSION },
});

const API_ENDPOINTS = {
	getAllJobs: '/jobs',
	uploadFile: '/raw-data/dashboard/import',
	uploadEmployeeMasterFile: '/raw-data/employee-master/import',
	getAllTrainingDashboardData: '/raw-data/training-dashboard',
	getAllBatchesData: '/raw-data/batch',
	getActiveEmployeesData: '/raw-data/active-employee',
	getResignedEmployeesData: '/raw-data/resigned-employee',
	uploadCertificationFile: '/raw-data/certification/import',
	getApprovedCertifications: '/raw-data/approved-certification',
	getOngoingCertifications: '/raw-data/on-going',
	getAchievedCertifications: '/raw-data/achieved',
	getNormalizedEmployees: '/employees',
	getNormalizedBatches: '/batches',
	getNormalizedTrainingDetails: '/training-details',
	getNormalizedAchievedCertifications: '/certifications/achieved',
	getNormalizedApprovedCertifications: '/certifications/approved',
	systemUser: '/system-users',
	auth: '/auth',
	updateBatchData: '/batches/:id',
	updateApprovedCertificationData: '/certifications/approved/:id',
	updateAchievedCertificationData: '/certifications/achieved/:id',
	getEmployeeDetails: '/employees/:id/training-details',
	tech: '/tech',
	techTraining: '/tech/training',
	assignmentOutline: '/assignment-outline',
	report: '/report',
	batchAssignmentOutline: '/batches/assignment-outline',
	feedbackAssignment: '/feedback/assignment',
	feedbackTrainees: '/feedback/trainees-batch',
	question: '/question',
	batchTree: '/batches/tree',
	updateAssignmentFeedbackData: '/feedback/assignment/:id',
	updateBatchAssignmentData: '/batches/assignment-outline/:id',
	updateAssignmentData: '/assignment-outline/:id',
	evaluationCriteria: '/evaluation-criteria',
};

export { API_ENDPOINTS, api };
