import { createSlice } from '@reduxjs/toolkit';
import { Helper } from '../../utils/helpers';

export const certificationSlice = createSlice({
	name: 'certification',
	initialState: {
		Approved: {
			searchText: '',
			sortColumn: '',
			sortOrder: '',
			fileName: 'Certification-Approved',
		},
		Achieved: {
			searchText: '',
			sortColumn: '',
			sortOrder: '',
			fileName: 'Certification-Achieved',
		},
		certificationType: 'Approved',
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
			state[certificationType].fileName = `Certification${
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
		resetCertification: (state) => {
			state.Approved = {
				searchText: '',
				sortColumn: '',
				sortOrder: '',
				fileName: 'Certification-Approved',
			};
			state.Achieved = {
				searchText: '',
				sortColumn: '',
				sortOrder: '',
				fileName: 'Certification-Achieved',
			};
			state.certificationType = 'Approved';
			state.activeTab = 0;
		},
	},
});

export const {
	setState,
	setCertificationType,
	setSortColumn,
	setSortOrder,
	setFileName,
	setActiveTab,
	resetCertification,
} = certificationSlice.actions;

export const selectCertificationData = (state: any) => state.certification;

export const selectCertificationType = (state: any) =>
	state.certification.certificationType;

export const selectActiveTab = (state: any) => state.certification.activeTab;

export default certificationSlice.reducer;
