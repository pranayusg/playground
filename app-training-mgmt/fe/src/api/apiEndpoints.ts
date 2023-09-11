import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
	baseURL: baseUrl,
});

const API_ENDPOINTS = {
	getAllJobs: '/job',
	uploadFile: '/raw-data/dashboard/import',
	getAllTrainingDashboardData: '/raw-data/training-dashboard',
	getAllBatchesData: '/raw-data/batch',
};

export { API_ENDPOINTS, api };
