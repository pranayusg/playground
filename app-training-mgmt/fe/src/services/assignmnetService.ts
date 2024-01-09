import { API_ENDPOINTS, api } from '../api/apiEndpoints';
import {
	AssignmentOutline,
	PaginatedTech,
	Tech,
	TechTraining,
} from '../interfaces/assignmnetInterface';
import store from '../store';

export class assignmentService {
	public static async getAllTech(
		pageNo: number | 1,
		orderBy: string,
		name: string,
		order: string
	): Promise<PaginatedTech> {
		let data: PaginatedTech;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${API_ENDPOINTS.tech}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${name ? `&name=${name}` : ''}`,
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

	public static async getAllTechTraining(
		pageNo: number | 1,
		orderBy: string,
		tech: string,
		order: string,
		topic: string
	): Promise<any> {
		let data: any;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.techTraining
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${tech ? `&tech=${tech}` : ''}${topic ? `&topic=${topic}` : ''}`,
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

	public static async createTech(body: Tech) {
		let data: any;
		try {
			const res = await api.post(`${API_ENDPOINTS.tech}`, body, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async createTechTraining(body: TechTraining) {
		let data: any;
		try {
			const res = await api.post(`${API_ENDPOINTS.techTraining}`, body, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async createAssignmentOutline(body: AssignmentOutline) {
		let data: any;
		try {
			const res = await api.post(`${API_ENDPOINTS.assignmentOutline}`, body, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async getAssignmentOutline(
		pageNo: number | 1,
		orderBy: string,
		tech: string,
		order: string
	) {
		let data: any;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.assignmentOutline
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
			${tech ? `&tech=${tech}` : ''}`,
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

	public static async getBatchAssignmentOutline(
		pageNo: number | 1,
		orderBy: string,
		order: string
	) {
		let data: any;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.batchAssignmentOutline
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}`,
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

	public static async createBatchAssignmentOutline(body: AssignmentOutline) {
		let data: any;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.batchAssignmentOutline}`,
				body,
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

	public static async getFeedbackAssignment(
		pageNo: number | 1,
		orderBy: string,
		employee: string,
		status: string,
		order: string
	) {
		let data: any;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.feedbackAssignment
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
			${employee ? `&employee=${employee}` : ''}${status ? `&status=${status}` : ''}`,
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

	public static async createAssignmentFeedback(body: AssignmentOutline) {
		let data: any;
		try {
			const res = await api.post(`${API_ENDPOINTS.feedbackAssignment}`, body, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async updateAssignmentFeedbackData(postData: any) {
		let data: any;
		const apiPath = API_ENDPOINTS.updateAssignmentFeedbackData.replace(
			':id',
			postData.id
		);
		try {
			const res = await api.patch(apiPath, postData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response.data;
		}
		return data;
	}

	public static async updateBatchAssignmentData(postData: any) {
		let data: any;
		const apiPath = API_ENDPOINTS.updateBatchAssignmentData.replace(
			':id',
			postData.id
		);
		try {
			const res = await api.patch(apiPath, postData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response.data;
		}
		return data;
	}

	public static async updateAssignmentData(postData: any) {
		let data: any;
		const apiPath = API_ENDPOINTS.updateAssignmentData.replace(
			':id',
			postData.id
		);
		try {
			const res = await api.patch(apiPath, postData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e: any) {
			return e.response.data;
		}
		return data;
	}

	public static async getEvaluationCriteria() {
		let data: any;
		try {
			const res = await api.get(`${API_ENDPOINTS.evaluationCriteria}`, {
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
}
