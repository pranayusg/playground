import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const batchSlice = createSlice({
	name: 'batch',
	initialState: {
		tech: '',
		status: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'batch',
	},
	reducers: {
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
				false,
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
		resetBatch: (state) => {
			state.tech = '';
			state.status = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'batch';
		},
	},
});

export const {
	setTech,
	setStatus,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetBatch,
} = batchSlice.actions;

export const selectTech = (state: any) => state.batch.tech;
export const selectStatus = (state: any) => state.batch.status;
export const selectFileName = (state: any) => state.batch.fileName;
export const selectSortColumn = (state: any) => state.batch.sortColumn;
export const selectSortOrder = (state: any) => state.batch.sortOrder;

export default batchSlice.reducer;
