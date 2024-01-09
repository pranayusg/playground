import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import { NormalizedBatchInterface } from '../interfaces/normalizeBatchInterface';
import { Batch } from '../interfaces/batchInterface';
import { PaginatedBatches } from '../interfaces/paginatedBatchesInterface';
import store from '../store';

export class batchService {
	public static async getAllBatchesData(
		type: string,
		pageNo: number | 1
	): Promise<PaginatedBatches> {
		let data: PaginatedBatches;
		const apiPath =
			type === 'normalize'
				? API_ENDPOINTS.getNormalizedBatches
				: API_ENDPOINTS.getAllBatchesData;
		const TOTAL_RECORDS = store.getState().global.noOfRecords;
		try {
			const res = await api.get(
				`${apiPath}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}`,
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

	public static async getAllBatchesDataForSort(
		type: string,
		pageNo: number | 1,
		orderBy: string,
		status: string | null,
		tech: string,
		order: string
	): Promise<PaginatedBatches> {
		let data: PaginatedBatches;
		const apiPath =
			type === 'normalize'
				? API_ENDPOINTS.getNormalizedBatches
				: API_ENDPOINTS.getAllBatchesData;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${apiPath}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${status ? `&status=${status}` : ''}${tech ? `&tech=${tech}` : ''}`,
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

	public static async getTechForBatches(type: string, trainer: boolean) {
		let data;
		const apiPath =
			type === 'normalize'
				? API_ENDPOINTS.getNormalizedBatches
				: API_ENDPOINTS.getAllBatchesData;
		try {
			const res = await api.get(
				`${apiPath}/tech${trainer ? `?trainer=${trainer}` : ''}`,
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

	public static async getStatusForBatches(type: string) {
		let data;
		const apiPath =
			type === 'normalize'
				? API_ENDPOINTS.getNormalizedBatches
				: API_ENDPOINTS.getAllBatchesData;
		try {
			const res = await api.get(`${apiPath}/status`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res.data;
		} catch (e) {
			return {};
		}
		return data;
	}

	public static async getParentBatches(trainer: boolean) {
		let data;
		try {
			const res = await api.get(
				`${API_ENDPOINTS.getNormalizedBatches}/parent${
					trainer ? `?trainer=${trainer}` : ''
				}`,
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

	public static async CreateBatch(body: NormalizedBatchInterface) {
		let data;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.getNormalizedBatches}`,
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

	public static async updateBatchData(postData: any) {
		let data: Batch;
		const apiPath = API_ENDPOINTS.updateBatchData.replace(':id', postData.id);
		try {
			const res = await api.patch(apiPath, postData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res.data;
		} catch (e: any) {
			return e.response.data;
		}
		return data;
	}

	public static async getBatchTree(trainer: boolean) {
		let data;
		try {
			const res = await api.get(
				`${API_ENDPOINTS.batchTree}${trainer ? `?trainer=${trainer}` : ''}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e: any) {
			return e.response.data;
		}
		return data;
	}
}
