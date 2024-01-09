import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const employeeSlice = createSlice({
	name: 'employee',
	initialState: {
		searchText: '',
		employeeType: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'employee',
	},
	reducers: {
		setSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setEmployeeType: (state, action) => {
			state.employeeType = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameEmployee(
				false,
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
		resetEmployee: (state) => {
			state.searchText = '';
			state.employeeType = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'employee';
		},
	},
});

export const {
	setSearchText,
	setEmployeeType,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetEmployee,
} = employeeSlice.actions;

export const selectSearchText = (state: any) => state.employee.searchText;

export const selectEmployeeType = (state: any) => state.employee.employeeType;

export const selectFileName = (state: any) => state.employee.fileName;
export const selectSortColumn = (state: any) => state.employee.sortColumn;
export const selectSortOrder = (state: any) => state.employee.sortOrder;

export default employeeSlice.reducer;
