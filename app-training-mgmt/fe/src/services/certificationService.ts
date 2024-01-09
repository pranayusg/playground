import { api, API_ENDPOINTS } from '../api/apiEndpoints';
import {
	NormalizedAchievedCertificationInterface,
	NormalizedApprovedCertificationInterface,
} from '../interfaces/normalizedCertificationInterface';
import { Certification } from '../interfaces/certificationInterface';
import { PaginatedCertifications } from '../interfaces/paginatedCertificationsInterface';
import store from '../store';

export class certificationService {
	static getApiPath = (type: any) => {
		let apiPath;
		switch (type) {
			case 'Approved':
				apiPath = API_ENDPOINTS.getApprovedCertifications;
				break;
			case 'normalizeAchieved':
				apiPath = API_ENDPOINTS.getNormalizedAchievedCertifications;
				break;
			case 'normalizeApproved':
				apiPath = API_ENDPOINTS.getNormalizedApprovedCertifications;
				break;
			case 'Achieved':
				apiPath = API_ENDPOINTS.getAchievedCertifications;
				break;
			default:
				apiPath = API_ENDPOINTS.getApprovedCertifications;
				break;
		}
		return apiPath;
	};

	public static async getCertifications(
		type: string,
		pageNo: number | 1,
		orderBy: string,
		order: string,
		filters: any
	): Promise<PaginatedCertifications> {
		let data: PaginatedCertifications;
		let queryParam = '';
		const endpoint = this.getApiPath(type);

		for (const key in filters) {
			if (filters.hasOwnProperty(key)) {
				queryParam += `&${key}=${filters[key]}`;
			}
		}
		try {
			const TOTAL_RECORDS = store.getState().global.noOfRecords;
			const res = await api.get(
				`${endpoint}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}
				${orderBy ? `&orderBy=${orderBy}` : ''}${
					order ? `&order=${order}` : ''
				}${queryParam}`,
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

	public static async createCertification(
		type: string,
		body:
			| NormalizedApprovedCertificationInterface
			| NormalizedAchievedCertificationInterface
	) {
		let data;
		const endpoint = this.getApiPath(type);
		try {
			const res = await api.post(`${endpoint}`, body, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			data = res;
		} catch (e) {
			return {};
		}
		return data;
	}
	public static async updateCertificationData(
		certificationType: string,
		postData: any
	) {
		let data: Certification;
		const endpoint =
			certificationType === 'Approved'
				? API_ENDPOINTS.updateApprovedCertificationData
				: API_ENDPOINTS.updateAchievedCertificationData;
		const apiPath = endpoint.replace(':id', postData.id);

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
}
