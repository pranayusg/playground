import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import { CreateTrainingDetailInterface } from '../interfaces/normalizedTrainingDetailInterface';
import { PaginatedTrainingDashboard } from '../interfaces/paginatedTrainingDashboardInterface';
import store from '../store';

export class trainingDashboardService {
	public static async getAllTrainingDashboardData(
		pageNo: number | 1
	): Promise<PaginatedTrainingDashboard> {
		let data: PaginatedTrainingDashboard;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${API_ENDPOINTS.getAllTrainingDashboardData}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e) {
			return {};
		}
		return data;
	}

	public static async getAllTrainingDashboardDataBySearcAndSort(
		type: string,
		pageNo: number | 1,
		searchText: string,
		sortBy?: string,
		order?: string,
		filters?: any
	): Promise<PaginatedTrainingDashboard> {
		let data: PaginatedTrainingDashboard;
		let queryParam = '';
		const apiPath =
			type === 'normalize'
				? API_ENDPOINTS.getNormalizedTrainingDetails
				: API_ENDPOINTS.getAllTrainingDashboardData;
		for (const key in filters) {
			if (filters.hasOwnProperty(key)) {
				queryParam += `&${key}=${filters[key]}`;
			}
		}
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${apiPath}?page=${pageNo}${searchText ? `&name=${searchText}` : ''}${
					TOTAL_RECORDS ? `&noOfRecords=${TOTAL_RECORDS}` : ''
				}${sortBy ? `&orderBy=${sortBy}` : ''}${
					order ? `&order=${order}` : ''
				}${queryParam ? queryParam : ''}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e) {
			return {};
		}
		return data;
	}

	public static async createTrainingDetail(
		body: CreateTrainingDetailInterface
	) {
		let data: any;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.getNormalizedTrainingDetails}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res;
		} catch (e) {
			return {};
		}
		return data;
	}
}
