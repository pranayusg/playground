import Swal from 'sweetalert2';
import { Summary } from '../interfaces/summaryInterface';
import moment from 'moment';
import { SystemUsersState } from '../interfaces/systemUserInterface';
import {
	resetGlobal,
	setNoOfRecords,
	setRefreshIntervalId,
	setTheme,
} from '../store/features/globalSlice';
import {
	resetTrainingDashboard,
	setFileName,
	setSearchText,
	setSortColumn,
	setSortOrder,
} from '../store/features/trainingDashboardSlice';
import {
	setFileName as batchSetFileName,
	setSortColumn as batchSetSortColumn,
	setSortOrder as batchSetSortOrder,
	setTech as batchSetTech,
	setStatus as batchSetStatus,
	resetBatch,
} from '../store/features/batchSlice';
import {
	setFileName as employeeSetFileName,
	setSearchText as employeeSetSearchText,
	setSortColumn as employeeSetSortColumn,
	setSortOrder as employeeSetSortOrder,
	setEmployeeType as employeeSetEmployeeType,
	resetEmployee,
} from '../store/features/employeeSlice';
import {
	setState as certificationState,
	resetCertification,
} from '../store/features/certificationSlice';
import {
	setState as normalizedBatchState,
	resetNormalizedBatch,
} from '../store/features/normalizedBatchSlice';
import {
	setState as normalizedEmployeeState,
	resetNormalizedEmployee,
} from '../store/features/normalizedEmployeeSlice';
import {
	setState as normalizedCertificationState,
	resetNormalizedCertification,
} from '../store/features/normalizedCertificationSlice';
import {
	setState as normalizedTrainingDetailsState,
	resetNormalizedTrainingDetail,
} from '../store/features/normalizedTrainingDetailsSlice';
import {
	setState as viewAssignmentState,
	resetViewAssignment,
} from '../store/features/viewAssignmentSlice';
import {
	setState as batchAssignmentState,
	resetBatchAssignment,
} from '../store/features/batchAssignmentSlice';
import {
	setState as feedbackAssignmentState,
	resetFeedbackAssignment,
} from '../store/features/feedbackAssignmentSlice';
import {
	setState as traineefeedbackState,
	resetTraineeFeedback,
} from '../store/features/traineeFeedbackSlice';
import { NavigateFunction } from 'react-router-dom';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import {
	CREATED_MESSAGE,
	ERROR_MESSAGE,
	POST_LOGIN_ROUTE,
	POST_LOGIN_ROUTE_TRAINEE,
	REFRESH_TOKEN_EXPIRY_DAYS,
	REFRESH_TOKEN_INTERVAL_MS,
} from '../constants/constants';
import { systemUserService } from '../services/systemUserService';
import { authService } from '../services/authService';
import store from '../store';

const keyNameMapping: any = {
	sheetName: 'Sheet Name',
	rowsInserted: 'Rows Inserted',
	rowsUpdated: 'Rows Updated',
	rowsRejected: 'Rows Rejected',
};

export const Helper = {
	getSummaryPopup: async (props: Summary[]) => {
		const propsText = props
			.map((item, index) => {
				const objectText = Object.entries(item)
					.map(([key, value]) => {
						const customKeyName = keyNameMapping[key] || key;
						return `${customKeyName}: <strong>${value}</strong>`;
					})
					.join('\n');
				return `${index + 1}. ${objectText}\n`;
			})
			.join('\n');

		let result = await Swal.fire({
			confirmButtonText: 'Close',
			title: 'Summary',
			html: `<pre>${propsText}</pre>`,
			width: 530,
			heightAuto: true,
		});
		return result;
	},

	getConfirmAlert: async (props: any) => {
		let result = await Swal.fire({
			showCancelButton: true,
			cancelButtonText: 'Cancel',
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!',
			...props,
		});
		return result;
	},

	formatDateColumns: (data: any, dateColumns: string[]) => {
		if (data.records)
			data.records.forEach((record: any) => {
				dateColumns.forEach((col: string) => {
					record[col] = record[col]
						? moment(new Date(record[col])).format('DD-MMM-YYYY')
						: record[col];
				});
			});

		return data;
	},

	formatDateTimeColumns: (data: any, dateColumns: string[]) => {
		if (data.records)
			data.records.forEach((record: any) => {
				dateColumns.forEach((col: string) => {
					record[col] = record[col]
						? moment(new Date(record[col])).format('DD-MMM-YYYY HH:mm')
						: record[col];
				});
			});

		return data;
	},

	getCleanString: (str: string) => {
		return (str = str.trim().replace(' ', '-'));
	},

	camelToFlat: (camel: string) => {
		const camelCase = camel.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
		let flat = '';
		camelCase.forEach((word) => {
			flat = flat + word.charAt(0).toUpperCase() + word.slice(1) + ' ';
		});
		return flat;
	},

	formatColumnNames: (colName: string) => {
		const toBeCapitalizedCols = ['doj'];
		return colName
			.split(/(?=[A-Z])|_/)
			.map((e1) => {
				const temp = e1
					.replace(/_/g, ' ')
					.replace(/no/gi, 'no.')
					.replace(/curr/gi, 'current');
				return temp === 'of'
					? temp
					: toBeCapitalizedCols.includes(e1)
					? e1.toUpperCase()
					: temp.replace(/^./, e1[0].toUpperCase());
			})
			.join(' ');
	},

	showHideGridColumns: (
		gridColumnApi: any,
		target: any,
		item: any,
		hiddenColumns: any,
		gridApi: any
	) => {
		const includesAction = gridColumnApi
			.getAllDisplayedColumns()
			.map((col: any) => col.colId)
			.includes('action');
		const length = includesAction ? 2 : 1;
		if (
			gridColumnApi.getAllDisplayedColumns().length === length &&
			!target.checked
		) {
			return { errorMsg: 'Atleast one grid column needs to be shown.' };
		} else {
			hiddenColumns[item.id].checked = !hiddenColumns[item.id].checked;
			if (gridColumnApi) {
				gridColumnApi.setColumnVisible(target.value, target.checked);
			}
			return hiddenColumns;
		}
	},

	resetShowHideColumns: (
		gridColumnApi: any,
		hiddenColumns: any,
		defaultHiddenColumns: any
	) => {
		hiddenColumns.forEach((item: any) => {
			item.checked = !defaultHiddenColumns.includes(item.name);
			gridColumnApi.setColumnVisible(item.name, item.checked);
			return item;
		});
		return hiddenColumns;
	},

	setUserState: (dispatch: any, userState: SystemUsersState) => {
		const initial = userState?.state;
		if (initial?.global.theme) {
			document
				.querySelector('html')
				?.setAttribute('data-theme', initial.global.theme);
			dispatch(setTheme(initial.global.theme));
		}
		if (initial?.global.noOfRecords) {
			dispatch(setNoOfRecords(initial.global.noOfRecords));
		}
		if (initial?.trainingDashboard.searchText)
			dispatch(setSearchText(initial.trainingDashboard.searchText));
		if (initial?.trainingDashboard.sortColumn)
			dispatch(setSortColumn(initial.trainingDashboard.sortColumn));
		if (initial?.trainingDashboard.sortOrder)
			dispatch(setSortOrder(initial.trainingDashboard.sortOrder));
		if (initial?.trainingDashboard.fileName)
			dispatch(setFileName(initial.trainingDashboard.fileName));
		if (initial?.batch.fileName)
			dispatch(batchSetFileName(initial.batch.fileName));
		if (initial?.batch.sortColumn)
			dispatch(batchSetSortColumn(initial.batch.sortColumn));
		if (initial?.batch.sortOrder)
			dispatch(batchSetSortOrder(initial.batch.sortOrder));
		if (initial?.batch.status) dispatch(batchSetStatus(initial.batch.status));
		if (initial?.batch.tech) dispatch(batchSetTech(initial.batch.tech));
		if (initial?.employee.searchText)
			dispatch(employeeSetSearchText(initial.employee.searchText));
		if (initial?.employee.sortColumn)
			dispatch(employeeSetSortColumn(initial.employee.sortColumn));
		if (initial?.employee.sortOrder)
			dispatch(employeeSetSortOrder(initial.employee.sortOrder));
		if (initial?.employee.employeeType)
			dispatch(employeeSetEmployeeType(initial.employee.employeeType));
		if (initial?.employee.fileName)
			dispatch(employeeSetFileName(initial.employee.fileName));
		if (initial?.certification)
			dispatch(certificationState(initial.certification));
		if (initial?.normalizedBatch)
			dispatch(normalizedBatchState(initial.normalizedBatch));
		if (initial?.normalizedEmployee)
			dispatch(normalizedEmployeeState(initial.normalizedEmployee));
		if (initial?.normalizedTrainingDetails)
			dispatch(
				normalizedTrainingDetailsState(initial.normalizedTrainingDetails)
			);
		if (initial?.normalizedCertification)
			dispatch(normalizedCertificationState(initial.normalizedCertification));
		if (initial?.viewAssignment)
			dispatch(viewAssignmentState(initial.viewAssignment));
		if (initial?.batchAssignment)
			dispatch(batchAssignmentState(initial.batchAssignment));
		if (initial?.feedbackAssignment)
			dispatch(feedbackAssignmentState(initial.feedbackAssignment));
		if (initial?.traineeFeedback)
			dispatch(traineefeedbackState(initial.traineeFeedback));
	},

	swalPropsEmailSent: {
		icon: 'info',
		title: 'Email sent',
		text: 'Please click on the set password in the mail to set your password.',
		confirmButtonText: 'Okay, got it!',
		showCancelButton: false,
	},

	swalPropsChangePassword: {
		icon: 'info',
		title: 'Reset Password',
		text: 'Are you sure you want to reset your password?',
		confirmButtonText: 'Yes, I want to reset it!',
		showCancelButton: true,
	},

	login: (
		loginResp: any,
		navigate: NavigateFunction,
		dispatch: Dispatch<AnyAction>,
		redirectTo = '',
		refreshIntervalId: any
	) => {
		localStorage.setItem('token', loginResp.access_token);
		localStorage.setItem('refreshToken', loginResp.refresh_token);
		localStorage.setItem('loggedInAt', new Date().toDateString());
		localStorage.setItem('role', loginResp.role);

		getStates().then((response: any) => {
			localStorage.setItem('userName', response.username.name);
			Helper.setUserState(dispatch, response);

			const intervId = setInterval(
				Helper.refreshToken,
				REFRESH_TOKEN_INTERVAL_MS,
				dispatch,
				navigate,
				refreshIntervalId
			);
			dispatch(setRefreshIntervalId(intervId));

			navigate(
				redirectTo !== ''
					? redirectTo
					: localStorage.getItem('role') === 'Trainee'
					? POST_LOGIN_ROUTE_TRAINEE
					: POST_LOGIN_ROUTE
			);
		});
	},

	refreshToken: async (
		dispatch: Dispatch<AnyAction>,
		navigate: NavigateFunction,
		refreshIntervalId: any
	) => {
		const refreshToken = localStorage.getItem('refreshToken');
		localStorage.getItem('loggedInAt');

		if (refreshToken && localStorage.getItem('loggedInAt')) {
			let expiryDate: any = localStorage.getItem('loggedInAt');
			if (expiryDate) {
				expiryDate = new Date(
					new Date(expiryDate).setDate(
						new Date(expiryDate).getDate() + REFRESH_TOKEN_EXPIRY_DAYS
					)
				);

				if (new Date() <= expiryDate) {
					const response = await authService.getNewAccessToken();
					if (response.access_token) {
						localStorage.setItem('token', response.access_token);
					}
				} else Helper.logout(store, dispatch, navigate, refreshIntervalId);
			}
		}
	},

	logout: (
		store: any,
		dispatch: Dispatch<AnyAction>,
		navigate: NavigateFunction,
		refreshIntervalId: any
	) => {
		systemUserService.setStateForUser(
			localStorage.getItem('CCI_ID') ?? '',
			store.getState()
		);

		document.querySelector('html')?.removeAttribute('data-theme');

		// Reset User state function will come here
		Helper.resetUserState(dispatch);
		localStorage.clear();
		clearInterval(refreshIntervalId);
		navigate('/');
	},

	resetUserState: (dispatch: any) => {
		dispatch(resetGlobal());
		dispatch(resetBatch());
		dispatch(resetCertification());
		dispatch(resetEmployee());
		dispatch(resetNormalizedBatch());
		dispatch(resetNormalizedCertification());
		dispatch(resetNormalizedEmployee());
		dispatch(resetNormalizedTrainingDetail());
		dispatch(resetTrainingDashboard());
		dispatch(resetViewAssignment());
		dispatch(resetBatchAssignment());
		dispatch(resetFeedbackAssignment());
		dispatch(resetTraineeFeedback());
	},

	formatDate(value: string) {
		return value && new Date(value);
	},

	showToastMessage(message: string, type: any) {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: type,
			title: message,
		});
	},

	setUsersInitialState(dispatch: Dispatch<AnyAction>) {
		getStates().then((response: any) => {
			Helper.setUserState(dispatch, response);
		});
	},

	getFileNameTrainingDashboard(
		normalized: boolean,
		sortOption: any,
		order: any,
		searchText: string
	) {
		return `${normalized ? 'Normalized-' : ''}Training-Details${
			searchText ? `-Search-${searchText}` : ''
		}${
			sortOption
				? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
				: ''
		}${order ? `-${order}` : ''}`;
	},

	getFileNameBatch(
		normalized: boolean,
		sortOption: any,
		order: any,
		tech: string,
		status: string
	) {
		return `${normalized ? 'Normalized-' : ''}Batch${
			tech ? `-Search-${tech}` : ''
		}${status ? `-Status-${status}` : ''}${
			sortOption
				? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
				: ''
		}${order ? `-${Helper.getCleanString(order)}` : ''}`;
	},

	getFileNameEmployee(
		normalized: boolean,
		sortOption: any,
		order: any,
		searchText: string
	) {
		return `${normalized ? 'Normalized-' : ''}Employee${
			searchText ? `-Search-${searchText}` : ''
		}${
			sortOption
				? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
				: ''
		}${order ? `-${Helper.getCleanString(order)}` : ''}`;
	},

	getFileNameCertification(
		sortOption: any,
		order: any,
		certificationType: string
	) {
		return `Certification-${certificationType}
		${
			sortOption
				? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
				: ''
		}${order ? `-${order}` : ''}`;
	},

	getFileNameAssignment(
		type: string,
		sortOption: any,
		order: any,
		searchTech: string,
		status: string
	) {
		return `${type}${searchTech ? `-Search-${searchTech}` : ''}${
			status ? `-Status-${status}` : ''
		}${
			sortOption
				? `-${Helper.getCleanString(Helper.camelToFlat(sortOption))}`
				: ''
		}${order ? `-${order}` : ''}`;
	},

	getFileNameTraineeFeedback(parentBatch: string, childBatch: string) {
		return `Trainee-Feedback${
			parentBatch ? `-Parent-Batch-${parentBatch}` : ''
		}${childBatch ? `-Child-Batch${childBatch}` : ''}`;
	},

	showSavedAlert(message?: string) {
		Swal.fire({
			title: message ? message : CREATED_MESSAGE,
			timer: 3500,
			timerProgressBar: true,
			showConfirmButton: false,
			icon: 'success',
		});
	},

	showErrorAlert() {
		Swal.fire({
			title: ERROR_MESSAGE,
			timer: 3500,
			timerProgressBar: true,
			showConfirmButton: false,
			icon: 'error',
		});
	},
};

const getStates = async () => {
	const data = await systemUserService.getStateForUser(
		localStorage.getItem('CCI_ID') ?? ''
	);
	return data;
};
