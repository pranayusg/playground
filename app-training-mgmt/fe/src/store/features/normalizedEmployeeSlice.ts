import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const normalizedEmployeeSlice = createSlice({
	name: 'normalizedEmployee',
	initialState: {
		searchText: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'Normalized-Employee',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.orderBy;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameEmployee(
				true,
				sortOption,
				order,
				state.searchText
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetNormalizedEmployee: (state) => {
			state.searchText = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'Normalized-Employee';
		},
	},
});

export const {
	setState,
	setSearchText,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetNormalizedEmployee,
} = normalizedEmployeeSlice.actions;

export const selectSearchText = (state: any) =>
	state.normalizedEmployee.searchText;
export const selectFileName = (state: any) => state.normalizedEmployee.fileName;
export const selectSortColumn = (state: any) =>
	state.normalizedEmployee.sortColumn;
export const selectSortOrder = (state: any) =>
	state.normalizedEmployee.sortOrder;

export default normalizedEmployeeSlice.reducer;
