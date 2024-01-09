import './styles/app.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './styles/ag-grid.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';
import UploadExcel from './components/UploadExcel/UploadExcel';
import EmployeeData from './components/Employee/Employee';
import TrainingDashboardData from './components/TrainingDashboard/TrainingDashboard';
import BatchData from './components/Batch/Batch';
import Header from './components/Header/Header';
import Jobs from './components/Job/Job';
import CertificationData from './components/Certification/Certification';
import { useState, useEffect } from 'react';
import {
	selectRefreshIntervalId,
	selectTheme,
	setRefreshIntervalId,
} from './store/features/globalSlice';
import NormalizedTrainingDetails from './components/NormalizedTrainingDetails/NormalizedTrainingDetails';
import NormalizedBatchData from './components/NormalizedBatchData/NormalizedBatchData';
import NormalizedEmployeeData from './components/NormalizedEmployeeData/NormalizedEmployeeData';
import NormalizedCertificationData from './components/NormalizedCertificationData/NormalizedCertificationData';
import Index from './components/Auth/Index';
import Login from './components/Auth/Login';
import { useSelector } from 'react-redux';
import AuthGuard from './components/Guards/AuthGuard';
import UnAuthGuard from './components/Guards/UnAuthGuard';
import Settings from './components/Settings/Settings';
import { Helper } from './utils/helpers';
import { useDispatch } from 'react-redux';
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails';
import Assignment from './components/Assignment/Assignment';
import Dashboard from './components/Dashboard/Dashboard';
import CustomCalender from './components/Dashboard/CustomCalender';
import BatchAssignment from './components/BatchAssignment/BatchAssignment';
import FeedbackAssignment from './components/FeedbackAssignment/FeedbackAssignment';
import Feedback from './components/Feedback/Feedback';
import SessionFeedbackForm from './components/Feedback/SessionFeedbackForm';
import { REFRESH_TOKEN_INTERVAL_MS } from './constants/constants';
import SystemUser from './components/SystemUser/SystsemUser';

function App() {
	const theme = useSelector(selectTheme);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = localStorage.getItem('token');
	const refreshIntervalId = useSelector(selectRefreshIntervalId);
	const [isTrainee, setIsTrainee] = useState(false);
	const [isTrainer, setIsTrainer] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('role') === null) {
			setIsTrainee(false);
			setIsTrainer(false);
		}
		if (localStorage.getItem('token')) {
			Helper.refreshToken(dispatch, navigate, refreshIntervalId);
			const intervId = setInterval(
				Helper.refreshToken,
				REFRESH_TOKEN_INTERVAL_MS,
				dispatch,
				navigate,
				refreshIntervalId
			);
			dispatch(setRefreshIntervalId(intervId));
		}
	}, []);

	useEffect(() => {
		if (theme)
			document.querySelector('html')?.setAttribute('data-theme', theme);
	}, [theme]);

	useEffect(() => {
		const themeChanged = localStorage.getItem('themeChanged');
		// if (token && themeChanged === 'false')
		// 	Helper.setUsersInitialState(dispatch);
		// localStorage.setItem('themeChanged', 'false');

		if (localStorage.getItem('role') === 'Trainee') setIsTrainee(true);

		if (localStorage.getItem('role') !== 'Trainee' && isTrainee === true)
			setIsTrainee(false);

		if (localStorage.getItem('role') === 'Trainer') setIsTrainer(true);

		if (localStorage.getItem('role') !== 'Trainer' && isTrainer === true)
			setIsTrainer(false);
	});

	return (
		<div className="App h-full">
			<Header isTrainee={isTrainee} isTrainer={isTrainer} />
			<Routes>
				<Route path="" element={<UnAuthGuard component={<Index />} />} />
				<Route path="/login" element={<UnAuthGuard component={<Login />} />} />
				<Route
					path="/calender"
					element={<AuthGuard component={<CustomCalender />} />}
				/>
				{!isTrainee && !isTrainer ? (
					<Route path="/raw-data">
						<Route
							path="training-details"
							element={<AuthGuard component={<TrainingDashboardData />} />}
						/>
						<Route
							path="batches"
							element={<AuthGuard component={<BatchData />} />}
						/>
						<Route
							path="employees"
							element={<AuthGuard component={<EmployeeData />} />}
						/>
						<Route
							path="certifications"
							element={<AuthGuard component={<CertificationData />} />}
						/>
						<Route
							path="import"
							element={<AuthGuard component={<UploadExcel />} />}
						/>
						<Route path="jobs" element={<AuthGuard component={<Jobs />} />} />
					</Route>
				) : null}
				<Route path="/normalize">
					{!isTrainee && (
						<Route
							path="training-details"
							element={<AuthGuard component={<NormalizedTrainingDetails />} />}
						/>
					)}
					<Route
						path="batches"
						element={
							<AuthGuard
								component={
									<NormalizedBatchData
										isTrainee={isTrainee}
										isTrainer={isTrainer}
									/>
								}
							/>
						}
					/>
					{!isTrainee && (
						<Route
							path="employees"
							element={<AuthGuard component={<NormalizedEmployeeData />} />}
						/>
					)}
					<Route
						path="certifications"
						element={
							<AuthGuard
								component={
									<NormalizedCertificationData isTrainee={isTrainee} />
								}
							/>
						}
					/>
				</Route>
				<Route
					path="/employee/:id/details"
					element={<AuthGuard component={<EmployeeDetails />} />}
				/>
				<Route path="/assignments">
					{!isTrainee && (
						<Route
							path="view"
							element={<AuthGuard component={<Assignment />} />}
						/>
					)}
					{!isTrainee ? (
						<Route
							path="batch"
							element={
								<AuthGuard
									component={<BatchAssignment isTrainer={isTrainer} />}
								/>
							}
						/>
					) : null}
					<Route
						path="feedback"
						element={
							<AuthGuard
								component={<FeedbackAssignment isTrainee={isTrainee} />}
							/>
						}
					/>
				</Route>
				{!isTrainee ? (
					<Route
						path="/dashboard"
						element={<AuthGuard component={<Dashboard />} />}
					/>
				) : null}
				<Route
					path="/feedback"
					element={
						<AuthGuard
							component={
								<Feedback isTrainee={isTrainee} isTrainer={isTrainer} />
							}
						/>
					}
				/>
				<Route
					path="/session-feedback"
					element={<UnAuthGuard component={<SessionFeedbackForm />} />}
				/>
				{!isTrainee && !isTrainer ? (
					<Route
						path="/system-user"
						element={<AuthGuard component={<SystemUser />} />}
					/>
				) : null}
				<Route path="*" element={<PageNotFound />} />.
			</Routes>
			<Settings />
		</div>
	);
}

export default App;
