
import { api, API_ENDPOINTS } from "../api/apiEndpoints";
import { TOTAL_RECORDS } from "../constants/constants";
import { PaginatedTrainingDashboard } from "../interfaces/paginatedTrainingDashboardInterface";

export class trainingDashboardService {

    public static async getAllTrainingDashboardData (
        pageNo: number | 1
    ): Promise<PaginatedTrainingDashboard> {
        let data: PaginatedTrainingDashboard;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllTrainingDashboardData}?page=${pageNo}&noOfRecords=${TOTAL_RECORDS}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };
     
    
    public static async getAllTrainingDashboardDataBySearcAndSort (
        pageNo: number | 1,
        searchText: string,
        sortBy: string
    ): Promise<PaginatedTrainingDashboard> {
        let data: PaginatedTrainingDashboard;
        try {
            const res = await api.get(
                `${API_ENDPOINTS.getAllTrainingDashboardData}?page=${pageNo}&name=${searchText}&noOfRecords=${TOTAL_RECORDS}&orderBy=${sortBy}`
            );
            data = res.data;
        } catch (e) {
            return {};
        }
        return data;
    };
}