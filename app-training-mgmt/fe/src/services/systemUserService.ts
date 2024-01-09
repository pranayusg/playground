import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import { PaginatedSystemUser } from '../interfaces/paginatedSystemUser';
import { SystemUsersState } from '../interfaces/systemUserInterface';
import store from '../store';

export class systemUserService {
	public static async getStateForUser(empId: string): Promise<any> {
		let data: SystemUsersState;
		try {
			const res = await api.get(
				`${API_ENDPOINTS.systemUser}/${empId}/details`,
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

	public static async setStateForUser(empId: string, state: any): Promise<any> {
		let data;
		try {
			const res = await api.patch(
				`${API_ENDPOINTS.systemUser}/${empId}/state`,
				{ state },
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

	public static async getAllSystemUsers(
		pageNo: number | 1,
		orderBy: string,
		order: string,
		role: string,
		name: string
	): Promise<PaginatedSystemUser> {
		let data: PaginatedSystemUser;
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${
					API_ENDPOINTS.systemUser
				}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					orderBy ? `&orderBy=${orderBy}` : ''
				}${order ? `&order=${order}` : ''}
				${name ? `&name=${name}` : ''}${role ? `&role=${role}` : ''}`,
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
	public static async updateSystemUserRole(payload: any) {
		let data: SystemUsersState;
		try {
			const res = await api.patch(
				`${API_ENDPOINTS.systemUser}/${payload.id}/role`,
				{ type: payload.type },
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
