import { configureStore } from '@reduxjs/toolkit';
import trainingDashboardReducer from './features/trainingDashboardSlice';
import employeeReducer from './features/employeeSlice';
import batchReducer from './features/batchSlice';
import CertificationReducer from './features/certificationSlice';
import globalReducer from './features/globalSlice';
import normalizedBatchReducer from './features/normalizedBatchSlice';
import normalizedTrainingDetailsReducer from './features/normalizedTrainingDetailsSlice';
import normalizedEmployeeReducer from './features/normalizedEmployeeSlice';
import normalizedCertificationReducer from './features/normalizedCertificationSlice';
import viewAssignmentReducer from './features/viewAssignmentSlice';
import feedbackAssignmentReducer from './features/feedbackAssignmentSlice';
import batchAssignmentReducer from './features/batchAssignmentSlice';
import traineeFeedbackReducer from './features/traineeFeedbackSlice';

const store = configureStore({
	reducer: {
		global: globalReducer,
		trainingDashboard: trainingDashboardReducer,
		employee: employeeReducer,
		batch: batchReducer,
		certification: CertificationReducer,
		normalizedBatch: normalizedBatchReducer,
		normalizedTrainingDetails: normalizedTrainingDetailsReducer,
		normalizedEmployee: normalizedEmployeeReducer,
		normalizedCertification: normalizedCertificationReducer,
		viewAssignment: viewAssignmentReducer,
		feedbackAssignment: feedbackAssignmentReducer,
		batchAssignment: batchAssignmentReducer,
		traineeFeedback: traineeFeedbackReducer,
	},
});

export default store;
