import { useEffect, useState } from 'react';
import { batchService } from '../../services/batchService';
import { Batch } from '../../interfaces/batchInterface';
import {
	BatchStatusSortColumns,
	BatchTableColumnNames,
	TOTAL_RECORDS,
} from '../../constants/constants';
import moment from 'moment';
import Pagination from '../Common/Pagination';
import Sort from '../Common/Sort';

function BatchData() {
	const defaultTech = 'Select Tech';
	const defaultStatus = 'Select Status';
	const [tableData, setTableData] = useState<any>();
	const [techValues, setTechValues] = useState([]);
	const [pageNo, setPageNo] = useState<number>(1);
	const [status, setStatus] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('');
	const [tech, setTech] = useState<string>('');
	const [sortBatches, setSortBatches] = useState<any>([]);

	useEffect(() => {
		getInitialData();

		const FilteredSortColumns = BatchTableColumnNames.filter(
			(column) =>
				column.name !== 'Batch Title' &&
				column.name !== 'Tech' &&
				column.name !== 'Status' &&
				column.name !== 'Is Processed' &&
				column.name !== 'Updated At'
		);
		const FilteredSortColumnsNames = FilteredSortColumns.map(
			(item) => item.name
		);
		setSortBatches(FilteredSortColumnsNames);
	}, []);

	const getInitialData = async () => {
		const data = await batchService.getAllBatchesData(1);
		if (data.records?.length) setTableData(data);

		const tempTech = await batchService.getTechForBatches();
		setTechValues(tempTech);
	};

	const handlePageClick = async (event: any) => {
		if (status !== defaultStatus || sortBy !== '' || tech !== defaultTech) {
			const data = await batchService.getAllBatchesDataForSort(
				event.selected + 1,
				sortBy,
				status,
				tech
			);
			setPageNo(event.selected + 1);
			if (data.records?.length) setTableData(data);
		} else {
			const data = await batchService.getAllBatchesData(event.selected + 1);
			setPageNo(event.selected + 1);
			if (data.records?.length) setTableData(data);
		}
	};

	const getSortedData = async (sortBy: string) => {
		const sortBatch = BatchTableColumnNames.find(
			(batch: any) => batch.name === sortBy
		);

		if (sortBatch) {
			const mappedSortBy = sortBatch.value;
			setSortBy(mappedSortBy);
			callAPIWithSorting(pageNo, mappedSortBy, status, tech);
		} else {
			console.error('Invalid sortBy value:', sortBy);
		}
	};

	const getSortedDataForStatus = async (status: string) => {
		if (status === defaultStatus) {
			setStatus('');
			setPageNo(1);
			callAPIWithSorting(1, sortBy, '', tech);
		} else {
			setStatus(status);
			setPageNo(1);
			callAPIWithSorting(1, sortBy, status, tech);
		}
	};

	const getSortedTech = async (tech: string) => {
		if (tech === defaultTech) {
			setTech('');
			setPageNo(1);
			callAPIWithSorting(1, sortBy, status, '');
		} else {
			setTech(tech);
			setPageNo(1);
			callAPIWithSorting(1, sortBy, status, tech);
		}
	};

	const callAPIWithSorting = async (
		page: number,
		sort: string,
		stat: string,
		tech: string
	) => {
		const data = await batchService.getAllBatchesDataForSort(
			page,
			sort,
			stat,
			tech
		);
		setTableData(data);
	};
	return (
		<div className="m-4">
			<div className="flex justify-end space-x-4 mb-4">
				<div>
					<img
						src="/filter.png"
						alt="filter"
						style={{ height: '30px', width: '30px' }}
						className="mr-2 mt-2"
					/>
				</div>

				<div>
					{sortBatches.length ? (
						<Sort
							options={sortBatches}
							getSortedData={getSortedData}
							defaultValue="Created At"
						/>
					) : null}
				</div>
				<div>
					{sortBatches.length ? (
						<Sort
							options={techValues}
							getSortedData={getSortedTech}
							defaultOption="Select Tech"
						/>
					) : null}
				</div>
				<div>
					<Sort
						options={BatchStatusSortColumns}
						getSortedData={getSortedDataForStatus}
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
									{BatchTableColumnNames.map((object: any, i) => (
										<th key={i}>{object.name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{tableData.records.map((data: Batch) => (
									<tr key={data.id} className="hover">
										<th className="overflow-text" title={data.batchTitle}>
											{data.batchTitle}
										</th>
										<th title={data.tech}>{data.tech}</th>
										<th
											title={
												data.startDate ? moment(data.startDate).format('L') : ''
											}
										>
											{data.startDate ? moment(data.startDate).format('L') : ''}
										</th>
										<th
											title={
												data.endDate ? moment(data.endDate).format('L') : ''
											}
										>
											{data.endDate ? moment(data.endDate).format('L') : ''}
										</th>
										<th title={data.trainingCoordinator}>
											{data.trainingCoordinator}
										</th>
										<th title={`${data.headTrainer}`}>{data.headTrainer}</th>
										<th title={`${data.NoOfTrainees}`}>{data.NoOfTrainees}</th>
										<th title={`${data.NoSuccess}`}>{data.NoSuccess}</th>
										<th title={`${data.NoFailed}`}>{data.NoFailed}</th>
										<th title={data.status}>{data.status}</th>
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

export default BatchData;
