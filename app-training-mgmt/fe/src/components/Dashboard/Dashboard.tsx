import { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboard.service';
import Stats from './Stats';
import GraphCard from './GraphCard';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);

const DOUGHNUT_VALUES = {
	label: 'certified employees',
	backgroundColor: [
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)',
	],
	borderColor: [
		'rgba(255, 99, 132, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
	],
	borderWidth: 2,
};

const TIME_PERIOD = [
	{ title: 'Overall data', value: 0 },
	{ title: 'Last 30 days', value: 1 },
	{ title: 'Last 3 months', value: 3 },
	{ title: 'Last 6 months', value: 6 },
	{ title: 'Last 1 year', value: 12 },
];

interface DashboardData {
	id: string;
	createdAt: string;
	updatedAt: string;
	period: number;
	value: {
		graph: any[];
		stats: any[];
	};
}

const initialDashboardData = {
	id: '1',
	createdAt: '',
	updatedAt: '',
	period: 0,
	value: {
		graph: [
			{
				noOfEmployeesCertifiedForCertification: {},
			},
		],
		stats: [],
	},
};

interface DognutData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor: string[];
		borderColor?: string[];
		borderWidth?: number;
	}[];
}

const initialDognutData = {
	labels: [],
	datasets: [
		{
			label: 'certified employees',
			data: [],
			backgroundColor: [],
			borderColor: [],
			borderWidth: 2,
		},
	],
};

const initialBarData = {
	labels: [],
	datasets: [
		{
			label: 'Batch strength',
			data: [],
			backgroundColor: [],
		},
	],
};

const getLabelsAndValues = (techVsCertifiedEmployees: any) => {
	const keys = Object.keys(techVsCertifiedEmployees);
	const values = Object.values(techVsCertifiedEmployees);

	const keyValueArr: any[] = keys.map((key: string, index: number) => ({
		key,
		value: values[index],
	}));
	const labels: string[] = [];
	const data: number[] = [];
	keyValueArr
		.sort((a, b) => b.value - a.value)
		.slice(0, 6)
		.forEach((record: any) => {
			labels.push(record.key);
			data.push(record.value);
		});

	return { labels, data };
};

export const options = {
	// responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
	},
};

const Dashboard = () => {
	useDocumentTitle('Dashboard | Training Management');
	const [dashboardData, setDashboardData] =
		useState<DashboardData>(initialDashboardData);
	// const [batches, setBatches] = useState([]);
	// const [period, setPeriod] = useState(0);
	const [dognutData, setDognutData] = useState<DognutData>(initialDognutData);
	const [barData, setBarData] = useState<DognutData>(initialBarData);

	useEffect(() => {
		loadDashboard();
	}, []);

	useEffect(() => {
		if (dashboardData.value.graph) {
			dashboardData.value.graph.forEach((graph: any) => {
				if (graph.techVsCertifiedEmployees) {
					if (Object.keys(graph.techVsCertifiedEmployees).length) {
						const labelsAndValues = getLabelsAndValues(
							graph.techVsCertifiedEmployees
						);
						setDognutData({
							labels: labelsAndValues.labels,
							datasets: [
								{
									data: labelsAndValues.data,
									...DOUGHNUT_VALUES,
								},
							],
						});
					} else setDognutData(initialDognutData);
				}

				if (graph.batchVsStrength) {
					if (Object.keys(graph.batchVsStrength).length) {
						setBarData({
							labels: Object.keys(graph.batchVsStrength),
							datasets: [
								{
									label: 'Strength',
									data: Object.values(graph.batchVsStrength),
									backgroundColor: ['rgba(53, 162, 235, 0.5)'],
								},
							],
						});
					} else setBarData(initialBarData);
				}
			});
		}
	}, [dashboardData]);

	const loadDashboard = async () => {
		const dashboardResp = await dashboardService.getDashboardData(0);
		if (dashboardResp.value) setDashboardData(dashboardResp);

		// const batchData: any = await batchService.getAllBatchesData(0);
		// setBatches(batchData.records);
	};

	const handleTimePeriodChange = async (e: any) => {
		const dashboardResp = await dashboardService.getDashboardData(
			e.target.value
		);
		// setPeriod(e.target.value);
		if (dashboardResp.value) setDashboardData(dashboardResp);
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Dashboard</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-200 shadow-xl min-h-[47rem]">
				<select
					defaultValue={0}
					className="select select-bordered w-full max-w-xs"
					onChange={handleTimePeriodChange}
				>
					{TIME_PERIOD.map((period: any, index: number) => (
						<option key={index} value={period.value}>
							{period.title}
						</option>
					))}
				</select>
				<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 mt-2 ">
					{dashboardData.value.stats.length
						? dashboardData.value.stats.map((stat: any, index: number) => (
							<Stats key={index} {...stat} />
						))
						: null}
				</div>
				{barData.labels.length ? (
					<GraphCard
						width="w-full"
						heading="Batch vs Strength"
						component={<Bar options={options} data={barData} />}
					/>
				) : null}
				{dognutData.labels.length ? (
					<GraphCard
						width="w-1/2"
						heading="Tech vs Certified employees(Top 6)"
						component={<Doughnut data={dognutData} />}
					/>
				) : null}
				{/* <GraphCard
					width="w-full"
					heading="Batch Calender"
					component={<BatchCalender batchData={batches} period={period} />}
				/> */}
			</div>
		</div>
	);
};

export default Dashboard;
