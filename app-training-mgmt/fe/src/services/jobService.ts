import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import { PaginatedJobDetails } from '../interfaces/paginatedJobDetailsInterface';
import { Upload } from '../interfaces/uploadInterface';
import store from '../store';

export class jobService {
	public static async uploadFile(body: File): Promise<Upload | any> {
		const file = new FormData();
		file.append('file', body);
		let data: Upload;
		try {
			const res = await api.post(`${API_ENDPOINTS.uploadFile}`, file, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async uploadEmployeeMasterFile(
		body: File
	): Promise<Upload | any> {
		const file = new FormData();
		file.append('file', body);
		let data: Upload;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.uploadEmployeeMasterFile}`,
				file,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async uploadCertificationFile(
		body: File
	): Promise<Upload | any> {
		const file = new FormData();
		file.append('file', body);
		let data: Upload;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.uploadCertificationFile}`,
				file,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async getJobsWithStatus(
		pageNo: number | 1,
		status: string
	): Promise<PaginatedJobDetails> {
		let data: PaginatedJobDetails;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${API_ENDPOINTS.getAllJobs}?${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					status ? `&status=${status}` : ''
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
}
