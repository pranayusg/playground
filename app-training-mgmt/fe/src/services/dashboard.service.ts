import { API_ENDPOINTS, api } from '../api/apiEndpoints';

export class dashboardService {
	public static async getDashboardData(period: number | 0) {
		let data;
		try {
			const res = await api.get(`${API_ENDPOINTS.report}?period=${period}`, {
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
}
