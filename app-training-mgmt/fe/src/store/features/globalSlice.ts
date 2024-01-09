import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
	name: 'global',
	initialState: {
		refreshIntervalId: null,
		theme: '',
		noOfRecords: 5,
	},
	reducers: {
		setTheme: (state, action) => {
			state.theme = action.payload;
		},
		setNoOfRecords: (state, action) => {
			state.noOfRecords = action.payload;
		},
		resetGlobal: (state) => {
			state.refreshIntervalId = null;
			state.theme = '';
			state.noOfRecords = 5;
		},
		setRefreshIntervalId: (state, action) => {
			state.refreshIntervalId = action.payload;
		},
	},
});

export const { setTheme, setNoOfRecords, resetGlobal, setRefreshIntervalId } =
	globalSlice.actions;

export const selectTheme = (state: any) => state.global.theme;

export const selectNoOfRecords = (state: any) => state.global.noOfRecords;

export const selectRefreshIntervalId = (state: any) =>
	state.global.refreshIntervalId;

export default globalSlice.reducer;
