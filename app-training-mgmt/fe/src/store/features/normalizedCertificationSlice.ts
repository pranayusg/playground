import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const normalizedCertificationSlice = createSlice({
	name: 'normalizedCertification',
	initialState: {
		Approved: {
			searchText: '',
			sortColumn: '',
			sortOrder: '',
			fileName: 'Normalized-Certification-Approved',
		},
		Achieved: {
			searchText: '',
			sortColumn: '',
			sortOrder: '',
			fileName: 'Normalized-Certification-Achieved',
		},
		certificationType:
			localStorage.getItem('role') === 'Trainee' ? 'Achieved' : 'Approved',
		activeTab: 0,
	},
	reducers: {
		setState: (state, { payload }) => {
			return payload;
		},
		setSortColumn: (state: any, { payload }) => {
			const type = state.certificationType;
			state[type].sortColumn = payload;
		},
		setSortOrder: (state: any, { payload }) => {
			const type = state.certificationType;
			state[type].sortOrder = payload;
		},
		setCertificationType: (state: any, { payload }) => {
			state.certificationType = payload;
		},
		setFileName: (state: any, { payload }) => {
			const sortOption = payload.orderBy;
			const order = payload.order;
			const certificationType = state.certificationType;
			state[certificationType].fileName = `Normalized-Certification${
				certificationType ? `-${Helper.getCleanString(certificationType)}` : ''
			}${
				sortOption
					? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
					: ''
			}${order ? `-${Helper.getCleanString(order)}` : ''}`;
		},
		setActiveTab: (state: any, { payload }) => {
			state.activeTab = payload;
		},
		resetNormalizedCertification: (state) => {
			state.Approved = {
				searchText: '',
				sortColumn: '',
				sortOrder: '',
				fileName: 'Normalized-Certification-Approved',
			};
			state.Achieved = {
				searchText: '',
				sortColumn: '',
				sortOrder: '',
				fileName: 'Normalized-Certification-Achieved',
			};
			state.certificationType = 'Approved';
			state.activeTab = 0;
		},
	},
});

export const {
	setCertificationType,
	setSortColumn,
	setSortOrder,
	setFileName,
	setState,
	setActiveTab,
	resetNormalizedCertification,
} = normalizedCertificationSlice.actions;

export const selectCertificationData = (state: any) =>
	state.normalizedCertification;

export const selectCertificationType = (state: any) =>
	state.normalizedCertification.certificationType;

export const selectActiveTab = (state: any) =>
	state.normalizedCertification.activeTab;

export default normalizedCertificationSlice.reducer;
