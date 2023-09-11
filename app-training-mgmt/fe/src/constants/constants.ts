export const TrainingDashboardTableColumnNames = [
	{ id: 1, name: 'Emp Id', value: 'empId' },
	{ id: 2, name: 'Name', value: 'name' },
	{ id: 3, name: 'Designation', value: 'designation' },
	{ id: 4, name: 'Reporting Manager', value: 'reportingManager' },
	{ id: 5, name: 'Client Director', value: 'clientDirector' },
	{ id: 6, name: 'Client Name', value: 'clientName' },
	{ id: 7, name: 'Resource Type', value: 'resourceType' },
	{ id: 8, name: 'DOJ', value: 'doj' },
	{ id: 9, name: 'Trainer', value: 'trainer' },
	{ id: 10, name: 'Type Of Training', value: 'typeOfTraining' },
	{ id: 11, name: 'Batch Type', value: 'batchType' },
	{ id: 12, name: 'Batch Type Description', value: 'batchTypeDescription' },
	{ id: 13, name: 'Training Start Date', value: 'trainingStartDate' },
	{ id: 14, name: 'Training End Date', value: 'trainingEndDate' },
	{ id: 15, name: 'Batch Status', value: 'batchStatus' },
	{ id: 16, name: 'Employee Status', value: 'employeeStatus' },
	{ id: 17, name: 'Is Processed', value: 'isProcessed' },
	{ id: 18, name: 'Created At', value: 'createdAt' },
	{ id: 19, name: 'Updated At', value: 'updatedAt' },
];

export const JobsTableColumnNames = [
	'File Name',
	'Status',
	'Summary',
	'Job Type',
	'Import Type',
	'Created At',
	'Updated At',
];

export const JobsTableStatusSortValues = ['New', 'Pending', 'Completed'];

export const BatchTableColumnNames = [
	{ id: 1, name: 'Batch Title', value: 'batchTitle' },
	{ id: 2, name: 'Tech', value: 'tech' },
	{ id: 3, name: 'Start Date', value: 'startDate' },
	{ id: 4, name: 'End Date', value: 'endDate' },
	{ id: 5, name: 'Training Coordinator', value: 'trainingCoordinator' },
	{ id: 6, name: 'Head Trainer', value: 'headTrainer' },
	{ id: 7, name: 'No. of Trainees', value: 'no_of_trainees' },
	{ id: 8, name: 'No. of Success', value: 'no_of_success' },
	{ id: 9, name: 'No. of Failed', value: 'no_of_failed' },
	{ id: 10, name: 'Status', value: 'status' },
	{ id: 11, name: 'Is Processed', value: 'isProcessed' },
	{ id: 12, name: 'Created At', value: 'createdAt' },
	{ id: 13, name: 'Updated At', value: 'updatedAt' },
];

export const BatchStatusSortColumns = [
	'On Going',
	'Completed',
	'Paused',
	'Planned',
];

export const TOTAL_RECORDS = 5;

export const API_ENDPOINTS = {
	getAllJobs: '/summary',
	uploadFile: '/upload',
	getAllTrainingDashboardData: `/excel/sheet/training-dashboard`,
	getAllBatchesData: `/excel/sheet/batches`,
};
