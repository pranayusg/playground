export const TrainingDashboardTableColumnNames = [
	'empId',
	'name',
	'designation',
	'reportingManager',
	'clientDirector',
	'clientName',
	'resourceType',
	'doj',
	'trainer',
	'typeOfTraining',
	'batchType',
	'batchTypeDescription',
	'trainingStartDate',
	'trainingEndDate',
	'batchStatus',
	'employeeStatus',
	'isProcessed',
	'createdAt',
	'updatedAt',
];

export const TrainingDashboardHiddenColumns = [
	'clientName',
	'currDesignation',
	'doj',
	'reportingManager',
	'trainingEndDate',
	'resourceType',
	'employeeStatus',
	'isProcessed',
	'updatedAt',
];

export const JobsTableColumnNames = [
	'fileName',
	'status',
	'summary',
	'jobType',
	'importType',
	'createdAt',
	'updatedAt',
];

export const JobsTableStatusSortValues = ['New', 'Pending', 'Completed'];

export const BatchTableColumnNames = [
	'batchTitle',
	'tech',
	'startDate',
	'endDate',
	'trainingCoordinator',
	'headTrainer',
	'noOfTrainees',
	'noSuccess',
	'noFailed',
	'status',
	'isProcessed',
	'createdAt',
	'updatedAt',
];

export const BatchTableHiddenColumns = [
	'isProcessed',
	'updatedAt',
	'no_of_success',
	'no_of_failed',
];

export const EmployeeTableColumnNames = [
	'employee',
	'employeeNumber',
	'email',
	'doj',
	'reportingTo',
	'currGrade',
	'currLocation',
	'presentCity',
	'presentState',
	'currDepartment',
	'currDesignation',
	'currDesForReporting',
	'leavingDate',
	'currClient1',
	'currClient2',
	'currClient3',
	'currClient4',
	'currExperience',
	'currPreviousEmployerExperience',
	'yearsServedInCurrDesignation',
	'currDesignationSince',
	'currBusinessSystemQualification',
	'currCoreTechStack',
	'currSecondaryTechStack',
	'currManagerialQualification',
	'currPresonalInterests',
	'employeeStatus',
	'createdAt',
	'updatedAt',
];

export const EmployeeTableHiddenColumns = [
	'currPreviousEmployerExperience',
	'currClient2',
	'currClient3',
	'currClient4',
	'updatedAt',
	'presentState',
	'currPresonalInterests',
	'employeeStatus',
];

export const approvedCertificationTableColumns = [
	'certificationName',
	'costInDollars',
	'level',
	'tech',
	'createdAt',
	'updatedAt',
];

export const achievedCertificationTableColumns = [
	'empId',
	'name',
	'certification',
	'exam',
	'level',
	'certificationLink',
	'achievedDate',
	'expiryDate',
	'createdAt',
	'updatedAt',
];

export const normalizedEmployeeColumns = [
	'id',
	'name',
	'email',
	'doj',
	'currDesignation',
	'status',
	'reportingTo.name',
	'coreTechStack',
	'secondaryTechStack',
	'currClient1',
	'currClient2',
	'currClient3',
	'currClient4',
];

export const normalizedBatchTableColumnNames = [
	'batchTitle',
	'techTopic',
	'trainingCoordinator',
	'headTrainer',
	'status',
	'startDate',
	'endDate',
	'noOfTrainees',
	'action',
];

export const normalizedApprovedCertificationTableColumns = [
	'certificationName',
	'costInDollars',
	'level',
	'tech',
	'action',
];

export const normalizedAchievedCertificationTableColumns = [
	'employeeId',
	'name',
	'certification',
	'tech',
	'level',
	'certificationLink',
	'achievedDate',
	'expiryDate',
	'action',
];

export const normalizedTrainingDetailsTableColumns = [
	'employeeID',
	'name',
	'currDesignation',
	'doj',
	'clientName',
	'employeeStatus',
	'reportingManager',
	'headTrainer',
	'batchTitle',
	'batchStatus',
	'batchTypeDescription',
	'trainingStartDate',
	'trainingEndDate',
];

export const editableAchievedCertificationColumns = [
	'certificationLink',
	'achievedDate',
	'expiryDate',
];

export const AssignmentTableColumns = [
	'topic',
	'tech',
	'trainingTopic',
	'trainingDescription',
	'duration',
	'link',
	'ratings',
	'action',
];

export const BatchAssignmentTableColumns = [
	'batchTitle',
	'headTrainer',
	'techTopic',
	'status',
	'assignmentTopic',
	'duration',
	'link',
	'ratings',
	'startDate',
	'endDate',
	'action',
];

export const FeedbackAssignmentTableColumns = [
	'employeeId',
	'name',
	'currClient1',
	'reportingTo',
	'assignmentTopic',
	'duration',
	'status',
	'submissionDate',
	'link',
	'ratings',
	'overallRatingComment',
	'miscComment',
	'action',
];

export const TraineeFeedbackTableColumns = [
	'employeeId',
	'name',
	'currClient1',
	'currDesignation',
	'techTopic',
	'headTrainer',
	'startDate',
	'endDate',
	'feedback',
];

export const SystemUserTableColumn = [
	'id',
	'name',
	'type',
	'lastLoggedIn',
	'action',
];

export const TOTAL_RECORDS = 5;

export const THEMES = ['default', 'light', 'cupcake', 'lofi', 'acid', 'garden'];

export const POST_LOGIN_ROUTE = '/dashboard';
export const POST_LOGIN_ROUTE_TRAINEE = '/normalize/batches';

export const BATCH_STATUS = [
	'Completed',
	'Not Planned',
	'On Going',
	'Paused',
	'Planned',
	'Stopped',
];

export const PAGE_OPTIONS = [5, 10, 15, 20];

export const CREATED_MESSAGE = 'Data Saved';
export const ERROR_MESSAGE = 'Something went wrong';

export const REFRESH_TOKEN_EXPIRY_DAYS = 7; //In days
export const REFRESH_TOKEN_INTERVAL_MS = 1000 * 60 * 60 * 20; // 20 hr
