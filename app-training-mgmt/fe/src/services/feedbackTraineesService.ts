import { API_ENDPOINTS, api } from '../api/apiEndpoints';
import { CreateFeedback } from '../interfaces/feedbackInterface';
import store from '../store';

export class feedbackTraineesService {
	public static async getTraineesFeedback(
		pageNo: number | 1,
		orderBy: string,
		batchId: string,
		order: string
	) {
		let data;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.feedbackTrainees
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${batchId ? `&batchId=${batchId}` : ''}`,
				{
					headers: {
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

	public static async getQuestions(
		token: any,
		pageNo: number | 1,
		orderBy: string,
		order: string,
		question: string,
		type: string
	) {
		let data;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${API_ENDPOINTS.question}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${question ? `&question=${question}` : ''}${type ? `&type=${type}` : ''}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async generateFeedbackForm(
		id: string,
		payload: { validity: string }
	) {
		let data;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.feedbackTrainees}/send-feedback/${id}`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async createFeedback(token: any, body: CreateFeedback) {
		let data: any;
		try {
			const res = await api.post(`${API_ENDPOINTS.feedbackTrainees}`, body, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}
}
