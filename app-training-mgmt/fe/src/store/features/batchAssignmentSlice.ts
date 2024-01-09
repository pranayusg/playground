import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const batchAssignmentSlice = createSlice({
	name: 'batchAssignment',
	initialState: {
		sortColumn: '',
		sortOrder: '',
		fileName: 'Batch-Assignment',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameAssignment(
				'Batch-Assignment',
				sortOption,
				order,
				'',
				''
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetBatchAssignment: (state) => {
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'Batch-Assignment';
		},
	},
});

export const {
	setState,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetBatchAssignment,
} = batchAssignmentSlice.actions;

export const selectFileName = (state: any) => state.batchAssignment.fileName;
export const selectSortColumn = (state: any) =>
	state.batchAssignment.sortColumn;
export const selectSortOrder = (state: any) => state.batchAssignment.sortOrder;

export default batchAssignmentSlice.reducer;
