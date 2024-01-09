import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import { EmployeeDetailsInterface } from '../interfaces/employeeDetailsInterface';
import { NormalizedEmployeeInterface } from '../interfaces/normalizedEmployeeInterface';
import { PaginatedEmployees } from '../interfaces/paginatedEmployeesInterface';
import store from '../store';

export class employeeService {
	static getApiPath = (type: any) => {
		let apiPath;
		switch (type) {
			case 'Active':
				apiPath = API_ENDPOINTS.getActiveEmployeesData;
				break;
			case 'Resigned':
				apiPath = API_ENDPOINTS.getResignedEmployeesData;
				break;
			case 'normalize':
				apiPath = API_ENDPOINTS.getNormalizedEmployees;
				break;
			default:
				apiPath = API_ENDPOINTS.getActiveEmployeesData;
				break;
		}
		return apiPath;
	};

	public static async getEmployees(
		type: string,
		pageNo: number | 1,
		searchText: string,
		orderBy: string,
		order: string
	): Promise<PaginatedEmployees> {
		let data: PaginatedEmployees;
		const endpoint = this.getApiPath(type);
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${endpoint}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}${
					searchText ? `&name=${searchText}` : ''
				}${orderBy ? `&orderBy=${orderBy}` : ''}${
					order ? `&order=${order}` : ''
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

	public static async getActiveEmployees(): Promise<
		NormalizedEmployeeInterface[]
	> {
		let data: NormalizedEmployeeInterface[];
		try {
			const res = await api.get(
				`${API_ENDPOINTS.getNormalizedEmployees}/active`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e) {
			return [];
		}
		return data;
	}

	public static async getEmployeesDetails(id: string) {
		let data: EmployeeDetailsInterface;
		try {
			const res = await api.get(
				`${API_ENDPOINTS.getEmployeeDetails.replace(':id', id)}`,
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

	public static async getEmployeesForBatch(
		batchId: string
	): Promise<NormalizedEmployeeInterface[]> {
		let data: NormalizedEmployeeInterface[];
		try {
			const res = await api.get(
				`${API_ENDPOINTS.getNormalizedEmployees}/${batchId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			data = res.data;
		} catch (e) {
			return [];
		}
		return data;
	}
}
