import { useEffect, useState } from 'react';
import { trainingDashboardService } from '../../services/trainingDashboardService';
import {
	TOTAL_RECORDS,
	TrainingDashboardTableColumnNames,
} from '../../constants/constants';
import { TrainingDashboard } from '../../interfaces/trainingDashboardInterface';
import moment from 'moment';
import Sort from '../Common/Sort';
import SearchBox from '../Common/SearchBox';
import Pagination from '../Common/Pagination';
// import { CSVLink, CSVDownload } from 'react-csv';

const TrainingDashboardData = () => {
	const [tableData, setTableData] = useState<any>();
	const [pageNo, setPageNo] = useState<number>(1);
	const [sortBy, setSortBy] = useState<string>('');
	const [searchText, setSearchText] = useState<string>('');
	const [sortTraining, setSortTraining] = useState<any>([]);

	useEffect(() => {
		getInitialData();

		const FilteredSortColumns = TrainingDashboardTableColumnNames.filter(
			(value: any) =>
				[
					'DOJ',
					'Training Start Date',
					'Training End Date',
					'Batch Type',
					'Created At',
				].includes(value.name)
		);
		const FilteredSortColumnsNames = FilteredSortColumns.map(
			(item) => item.name
		);
		setSortTraining(FilteredSortColumnsNames);
	}, []);

	const getInitialData = async () => {
		const data = await trainingDashboardService.getAllTrainingDashboardData(1);
		if (data.records?.length) setTableData(data);
	};

	const getSortedData = async (sortBy: string) => {
		const sort = TrainingDashboardTableColumnNames.find(
			(item: any) => item.name === sortBy
		);

		if (sort) {
			const mappedSortBy = sort.value;
			setSortBy(mappedSortBy);
			const data =
				await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
					pageNo,
					searchText,
					mappedSortBy
				);
			setTableData(data);
		} else {
			console.error('Invalid sortBy value:', sortBy);
		}
	};

	const getSearchText = async (searchText: string) => {
		setSearchText(searchText);
		const data =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				1,
				searchText,
				sortBy
			);
		if (data.records?.length) setTableData(data);
	};

	const handlePageClick = async (event: any) => {
		if (sortBy || searchText) {
			const data =
				await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
					event.selected + 1,
					searchText,
					sortBy
				);
			setPageNo(event.selected + 1);
			if (data.records?.length) setTableData(data);
		} else {
			const data = await trainingDashboardService.getAllTrainingDashboardData(
				event.selected + 1
			);
			setPageNo(event.selected + 1);
			if (data.records?.length) setTableData(data);
		}
	};

	return (
		<div className="m-4">
			<div className="flex justify-between mb-4">
				<SearchBox
					placeholder={'Search by name…'}
					getSearchText={getSearchText}
				/>
				<div className="flex justify-end space-x-4">
					<img
						src="/filter.png"
						alt="filter"
						style={{ height: '30px', width: '30px' }}
						className="mr-1 mt-2"
					/>
					{sortTraining.length ? (
						<Sort
							options={sortTraining}
							getSortedData={getSortedData}
							defaultValue={sortTraining[4]}
						/>
					) : null}
					{/* <CSVLink data={csvData}>Download me</CSVLink>; */}
				</div>
			</div>
			{tableData?.records.length ? (
				<div className="overflow-x-auto">
					<table className="table bg-white">
						<thead>
							<tr className="table-heading">
								{TrainingDashboardTableColumnNames.map((object: any, i) => (
									<th key={i}>{object.name}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{tableData.records.map((data: TrainingDashboard, i: number) => (
								<tr key={i} className="hover">
									<th title={data.empId}>{data.empId}</th>
									<th title={data.name}>{data.name}</th>
									<th title={data.designation}>{data.designation}</th>
									<th title={data.reportingManager}>{data.reportingManager}</th>
									<th title={data.clientDirector}>{data.clientDirector}</th>
									<th title={data.clientName}>{data.clientName}</th>
									<th className="overflow-text" title={data.resourceType}>
										{data.resourceType}
									</th>
									<th title={data.doj ? moment(data.doj).format('L') : ''}>
										{data.doj ? moment(data.doj).format('L') : ''}
									</th>
									<th title={data.trainer}>{data.trainer}</th>
									<th title={data.typeOfTraining}>{data.typeOfTraining}</th>
									<th className="overflow-text" title={data.batchType}>
										{data.batchType}
									</th>
									<th title={data.batchTypeDescription}>
										{data.batchTypeDescription}
									</th>
									<th
										title={
											data.trainingStartDate
												? moment(data.trainingStartDate).format('L')
												: ''
										}
									>
										{data.trainingStartDate
											? moment(data.trainingStartDate).format('L')
											: ''}
									</th>
									<th
										title={
											data.trainingEndDate
												? moment(data.trainingEndDate).format('L')
												: ''
										}
									>
										{data.trainingEndDate
											? moment(data.trainingEndDate).format('L')
											: ''}
									</th>
									<th title={data.batchStatus}>{data.batchStatus}</th>
									<th title={data.employeeStatus}>{data.employeeStatus}</th>
									<th title={`${data.isProcessed}`}>{data.isProcessed}</th>
									<th
										title={
											data.createdAt ? moment(data.createdAt).format('L') : ''
										}
									>
										{data.createdAt ? moment(data.createdAt).format('L') : ''}
									</th>
									<th
										title={
											data.updatedAt ? moment(data.updatedAt).format('L') : ''
										}
									>
										{data.updatedAt ? moment(data.updatedAt).format('L') : ''}
									</th>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center mt-12 text-lg font-bold">
					No records found!
				</div>
			)}
			{tableData?.records.length && tableData.totalRecords > TOTAL_RECORDS ? (
				<Pagination
					totalPages={tableData.totalPages}
					handlePageClick={handlePageClick}
				/>
			) : null}
		</div>
	);
};

export default TrainingDashboardData;
