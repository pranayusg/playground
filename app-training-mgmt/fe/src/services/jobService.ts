import { api, API_ENDPOINTS } from "../api/apiEndpoints";
import { TOTAL_RECORDS } from "../constants/constants";
import { PaginatedJobDetails } from "../interfaces/paginatedJobDetailsInterface";
import { Upload } from "../interfaces/uploadInterface";

export class jobService {
    
    public static async getAllJobs (
        pageNo: number | 1
    ): Promise<PaginatedJobDetails> {
        let data: PaginatedJobDetails;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllJobs}/${pageNo}?noOfRecords=${TOTAL_RECORDS}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };

    public static async uploadFile(body: File): Promise<Upload> {
        const file = new FormData();
        file.append('file', body);
        let data: Upload;
        try {
            const res = await api.post(`${API_ENDPOINTS.uploadFile}`, file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };

    public static async getJobsWithStatus (
        pageNo: number | 1,
        status: string
    ): Promise<PaginatedJobDetails> {
        let data: PaginatedJobDetails;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllJobs}/${pageNo}?noOfRecords=${TOTAL_RECORDS}&status=${status}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };
}