import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const normalizedBatchSlice = createSlice({
	name: 'normalizedBatch',
	initialState: {
		tech: '',
		status: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'Normalized-Batch',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setTech: (state, action) => {
			state.tech = action.payload;
		},
		setStatus: (state, action) => {
			state.status = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameBatch(
				true,
				sortOption,
				order,
				state.tech,
				state.status
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetNormalizedBatch: (state) => {
			state.tech = '';
			state.status = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'Normalized-Batch';
		},
	},
});

export const {
	setState,
	setTech,
	setStatus,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetNormalizedBatch,
} = normalizedBatchSlice.actions;

export const selectTech = (state: any) => state.normalizedBatch.tech;
export const selectStatus = (state: any) => state.normalizedBatch.status;
export const selectFileName = (state: any) => state.normalizedBatch.fileName;
export const selectSortColumn = (state: any) =>
	state.normalizedBatch.sortColumn;
export const selectSortOrder = (state: any) => state.normalizedBatch.sortOrder;

export default normalizedBatchSlice.reducer;
