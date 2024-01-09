import { AxiosError } from 'axios';
import { API_ENDPOINTS, api } from '../api/apiEndpoints';
import {
	LoginPayload,
	LoginResponse,
	SetPasswordPayload,
} from '../interfaces/loginInterface';
import { SetPasswordResponse } from '../interfaces/loginInterface';

export class authService {
	public static async login(body: LoginPayload) {
		let data: LoginResponse;
		try {
			const res = await api.post(`${API_ENDPOINTS.auth}/login`, body);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async setPassword(token: string, body: SetPasswordPayload) {
		let data: SetPasswordResponse;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.auth}/set-password/${token}`,
				body
			);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async resetPassword(username: string) {
		let data: any;
		try {
			const res = await api.post(
				`${API_ENDPOINTS.auth}/forgot-password/${username}`
			);
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async changePasswordTokenGenerate() {
		let data: { token: string };
		try {
			const res = await api.get(`${API_ENDPOINTS.auth}/change-password/`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}

	public static async getNewAccessToken() {
		let data: { token: string };
		try {
			const res = await api.get(`${API_ENDPOINTS.auth}/refresh`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
				},
			});
			data = res.data;
		} catch (e: any) {
			return e.response;
		}
		return data;
	}
}
