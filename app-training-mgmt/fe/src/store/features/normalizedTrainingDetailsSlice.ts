import { createSlice } from '@reduxjs/toolkit';

export const normalizedTrainingDetailsSlice = createSlice({
	name: 'normalizedTrainingDetails',
	initialState: {
		searchText: '',
		fileName: 'Normalized-Training-Details',
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setFileName: (state, { payload }) => {
			state.fileName = `Normalized-Training-Details${
				payload.searchText ? `-Search-${payload.searchText}` : ''
			}`;
		},
		resetNormalizedTrainingDetail: (state) => {
			state.searchText = '';
			state.fileName = 'Normalized-Training-Details';
		},
	},
});

export const {
	setState,
	setSearchText,
	setFileName,
	resetNormalizedTrainingDetail,
} = normalizedTrainingDetailsSlice.actions;

export const selectFileName = (state: any) =>
	state.normalizedTrainingDetails.fileName;

export const selectSearchText = (state: any) =>
	state.normalizedTrainingDetails.searchText;

export default normalizedTrainingDetailsSlice.reducer;
