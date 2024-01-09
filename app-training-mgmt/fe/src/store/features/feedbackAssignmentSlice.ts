import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const feedbackAssignmentSlice = createSlice({
	name: 'feedbackAssignment',
	initialState: {
		searchEmployee: '',
		status: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'Assignment-Feedback',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setSearchEmployee: (state, action) => {
			state.searchEmployee = action.payload;
		},
		setStatus: (state, action) => {
			state.status = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameAssignment(
				'Assignment-Feedback',
				sortOption,
				order,
				state.searchEmployee,
				state.status
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetFeedbackAssignment: (state) => {
			state.searchEmployee = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.status = '';
			state.fileName = 'Assignment-Feedback';
		},
	},
});

export const {
	setState,
	setSearchEmployee,
	setStatus,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetFeedbackAssignment,
} = feedbackAssignmentSlice.actions;

export const selectSearchEmployee = (state: any) =>
	state.feedbackAssignment.searchEmployee;
export const selectStatus = (state: any) => state.feedbackAssignment.status;
export const selectFileName = (state: any) => state.feedbackAssignment.fileName;
export const selectSortColumn = (state: any) =>
	state.feedbackAssignment.sortColumn;
export const selectSortOrder = (state: any) =>
	state.feedbackAssignment.sortOrder;

export default feedbackAssignmentSlice.reducer;
