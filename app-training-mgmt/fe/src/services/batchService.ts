import { api, API_ENDPOINTS } from "../api/apiEndpoints";
import { TOTAL_RECORDS } from "../constants/constants";
import { PaginatedBatches } from "../interfaces/paginatedBatchesInterface";

export class batchService {
    
    public static async getAllBatchesData (
        pageNo: number | 1
    ): Promise<PaginatedBatches> {
        let data: PaginatedBatches;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllBatchesData}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };

    public static async getAllBatchesDataForSort (
        pageNo: number | 1,
        orderBy: string,
        status: string | null,
        tech: string
    ): Promise<PaginatedBatches> {
        let data: PaginatedBatches;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllBatchesData}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}&orderBy=${orderBy}&status=${status}&tech=${tech}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };

    public static async getTechForBatches () {
        let data;
        try {
            const res = await api.get(`${API_ENDPOINTS.getAllBatchesData}/tech`);
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };
}