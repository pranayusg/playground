import { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import {
	JobsTableColumnNames,
	JobsTableStatusSortValues,
	TOTAL_RECORDS,
} from '../../constants/constants';
import { JobDetails } from '../../interfaces/jobDetailsInterface';
import { Summary } from '../../interfaces/summaryInterface';
import moment from 'moment';
import { SummaryHelper } from '../../utils/helpers';
import Pagination from '../Common/Pagination';
import Sort from '../Common/Sort';

function Jobs() {
	const defaultStatus = 'Select Status';
	const [tableData, setTableData] = useState<any>();
	const [status, setStatus] = useState<string>(defaultStatus);

	useEffect(() => {
		getInitialData();
	}, []);

	const getInitialData = async () => {
		const data = await jobService.getAllJobs(1);
		if (data.records?.length) setTableData(data);
	};

	const handlePageClick = async (event: any) => {
		if (status !== defaultStatus) {
			const data = await jobService.getJobsWithStatus(
				event.selected + 1,
				status
			);
			setTableData(data);
		} else {
			const data = await jobService.getAllJobs(event.selected + 1);
			if (data.records?.length) setTableData(data);
		}
	};

	const viewSummary = (data: Summary[]) => {
		SummaryHelper.getSummaryPopup(data);
	};

	const getSortedData = async (status: string) => {
		setStatus(status);
		if (status === 'Select Status') {
			const data = await jobService.getAllJobs(1);
			setTableData(data);
		} else {
			const data = await jobService.getJobsWithStatus(1, status);
			setTableData(data);
		}
	};

	return (
		<div className="m-4">
			<div className="flex justify-between mb-4">
				<div></div>
				<div>
					<Sort
						options={JobsTableStatusSortValues}
						getSortedData={getSortedData}
						defaultOption="Select Status"
					/>
				</div>
			</div>
			{tableData?.records.length ? (
				<div>
					<div className="overflow-x-auto">
						<table className="table bg-white">
							<thead>
								<tr>
									{JobsTableColumnNames.map((name: string, i) => (
										<th key={i}>{name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{tableData.records.map((data: JobDetails) => (
									<tr key={data.jobId} className="hover">
										<th title={data.fileName}>{data.fileName}</th>
										<th title={data.status}>{data.status}</th>
										<th>
											{data.summary ? (
												<button
													className="link link-primary"
													onClick={() => viewSummary(data.summary)}
												>
													View Summary
												</button>
											) : (
												<button disabled>No Summary</button>
											)}
										</th>
										<th title={data.jobType}>{data.jobType}</th>
										<th title={data.importType}>{data.importType}</th>
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
}

export default Jobs;
