import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

// Create the thunk
/*export const fetchTableData = createAsyncThunk(
	'trainingDashboard/fetchTableData',
	async (payload: TableDataPayload, thunkAPI) => {
		let data =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				payload.pageNo || 1,
				payload.searchText,
				payload.sortOption,
				payload.order
			);

		if (data.records?.length)
			data = Helper.formatDateColumns(data, dateColumns);
		return data;
	}
);
*/

export const trainingDashboardSlice = createSlice({
	name: 'trainingDashboard',
	initialState: {
		searchText: '',
		sortColumn: '',
		sortOrder: '',
		fileName: 'Training-Details',
		// tableData: {},
	},
	reducers: {
		// Standard reducer logic, with auto-generated action types per reducer

		setSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setFileName: (state, action) => {
			const sortOption = action.payload.sortOption;
			const order = action.payload.order;

			state.fileName = Helper.getFileNameTrainingDashboard(
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
		resetTrainingDashboard: (state) => {
			state.searchText = '';
			state.sortColumn = '';
			state.sortOrder = '';
			state.fileName = 'Training-Details';
		},
	},
	/*extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed

		builder.addCase(fetchTableData.fulfilled, (state, action) => {
			// Add API response to the state
			state.tableData = action.payload;
		});
	},*/
});

export const {
	setSearchText,
	setFileName,
	setSortColumn,
	setSortOrder,
	resetTrainingDashboard,
} = trainingDashboardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectSearchText = (state: any) =>
	state.trainingDashboard.searchText;

export const selectFileName = (state: any) => state.trainingDashboard.fileName;
export const selectSortColumn = (state: any) =>
	state.trainingDashboard.sortColumn;
export const selectSortOrder = (state: any) =>
	state.trainingDashboard.sortOrder;
// export const selecTableData = (state: any) => state.trainingDashboard.tableData;

export default trainingDashboardSlice.reducer;

// call the thunk
// dispatch(fetchTableData(payload));
