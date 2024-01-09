import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const viewAssignmentSlice = createSlice({
	name: 'viewAssignment',
	initialState: {
		searchTech: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'Assignment',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setSearchTech: (state, action) => {
			state.searchTech = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameAssignment(
				'Assignment',
				sortOption,
				order,
				state.searchTech,
				''
			);
		},
		setSortColumn: (state, action) => {
			state.sortColumn = action.payload;
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload;
		},
		resetViewAssignment: (state) => {
			state.searchTech = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'Assignment';
		},
	},
});

export const {
	setState,
	setSearchTech,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetViewAssignment,
} = viewAssignmentSlice.actions;

export const selectSearchTech = (state: any) => state.viewAssignment.searchTech;
export const selectFileName = (state: any) => state.viewAssignment.fileName;
export const selectSortColumn = (state: any) => state.viewAssignment.sortColumn;
export const selectSortOrder = (state: any) => state.viewAssignment.sortOrder;

export default viewAssignmentSlice.reducer;
