import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const traineeFeedbackSlice = createSlice({
	name: 'traineeFeedback',
	initialState: {
		parentBatch: {
			techTopic: '',
			children: [],
		},
		childBatch: {
			techTopic: '',
		},
		sortColumn: '',
		sortOrder: '',
		fileName: 'trainee-feedback',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setParentBatch: (state, action) => {
			state.parentBatch = action.payload;
		},
		setChildBatch: (state, action) => {
			state.childBatch = action.payload;
		},
		setFileName: (state, action) => {
			state.fileName = Helper.getFileNameTraineeFeedback(
				state.parentBatch.techTopic,
				state.childBatch.techTopic
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetTraineeFeedback: (state) => {
			state.parentBatch = {
				techTopic: '',
				children: [],
			};
			state.sortColumn = '';
			state.sortOrder = '';
			state.childBatch = {
				techTopic: '',
			};
			state.fileName = 'trainee-feedback';
		},
	},
});

export const {
	setState,
	setParentBatch,
	setChildBatch,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetTraineeFeedback,
} = traineeFeedbackSlice.actions;

export const selectChildBatch = (state: any) =>
	state.traineeFeedback.childBatch;
export const selectParentBatch = (state: any) =>
	state.traineeFeedback.parentBatch;
export const selectFileName = (state: any) => state.traineeFeedback.fileName;
export const selectSortColumn = (state: any) =>
	state.traineeFeedback.sortColumn;
export const selectSortOrder = (state: any) => state.traineeFeedback.sortOrder;

export default traineeFeedbackSlice.reducer;
