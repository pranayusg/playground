import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { jobService } from '../../services/jobService';
import {
	JobsTableColumnNames,
	JobsTableStatusSortValues,
} from '../../constants/constants';
import { JobDetails } from '../../interfaces/jobDetailsInterface';
import { Summary } from '../../interfaces/summaryInterface';
import { Helper } from '../../utils/helpers';
import Sort from '../Common/Sort';
import SummaryButtonRenderer from '../Common/SummaryButton';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { useSelector } from 'react-redux';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function Jobs() {
	const defaultStatus = 'Select Status';
	useDocumentTitle('Jobs | Training Management');
	const [status, setStatus] = useState<string>('');
	const [columnDefs, setColumnDefs] = useState<any>();
	const [gridApi, setGridApi] = useState<any>();
	const dateColumns = ['createdAt', 'updatedAt'];
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns();
	}, []);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params: any) => {
					const { filterModel } = params;
					const page = params.endRow / TOTAL_RECORDS;
					let statusFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						statusFilter +=
							fil === 'status' ? `${filterModel[fil].filter}` : '';
					});
					getData(page || 1, statusFilter || status).then((data) => {
						gridApi.hideOverlay();
						params.successCallback(data.records, data.totalRecords);
						if (data.records && !data.records.length) {
							gridApi.showNoRowsOverlay();
						}
					});
				},
			};
			gridApi.setDatasource(dataSource);
		}
	}, [gridApi, status]);

	const onGridReady = (params: any) => {
		setGridApi(params.api);
	};

	const setColumns = () => {
		const columns: any = [];
		JobsTableColumnNames.forEach((e1) =>
			e1 === 'summary'
				? columns.push({
					field: e1,
					cellRenderer: SummaryButtonRenderer,
				})
				: columns.push({
					minWidth: 247,
					field: e1,
					tooltipField: e1,
				})
		);
		setColumnDefs(columns);
	};

	const getData = async (pageNo: number, status: string) => {
		let data = await jobService.getJobsWithStatus(pageNo || 1, status);

		if (data.records?.length) {
			data = Helper.formatDateColumns(data, dateColumns);
		}
		return data;
	};

	const getSortedData = async (status: string) => {
		status === defaultStatus ? setStatus('') : setStatus(status);
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Jobs</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-between mb-4">
					<div></div>
					<div>
						<Sort
							options={[defaultStatus].concat(JobsTableStatusSortValues)}
							getSortedData={getSortedData}
							defaultValue={defaultStatus}
						/>
					</div>
				</div>
				<div className="ag-theme-alpine p-3" style={{ height: '100%' }}>
					<AgGridReact
						pagination={true}
						rowModelType={'infinite'}
						paginationPageSize={TOTAL_RECORDS}
						cacheBlockSize={TOTAL_RECORDS}
						onGridReady={onGridReady}
						columnDefs={columnDefs}
						animateRows={true}
						domLayout={'autoHeight'}
						className="text-base"
					/>
				</div>
			</div>
		</div>
	);
}

export default Jobs;
