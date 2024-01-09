import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';

import {
	TrainingDashboardHiddenColumns,
	normalizedTrainingDetailsTableColumns,
} from '../../constants/constants';

import SearchBox from '../Common/SearchBox';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { trainingDashboardService } from '../../services/trainingDashboardService';
import {
	selectSearchText,
	selectFileName,
	setFileName,
	setSearchText,
} from '../../store/features/normalizedTrainingDetailsSlice';
import AddTrainingDetails from './AddTrainingDetail';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

const dateColumns = [
	'doj',
	'trainingStartDate',
	'trainingEndDate',
	'createdAt',
	'updatedAt',
];

const NormalizeTrainingDetails = () => {
	useDocumentTitle('Training Details | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState();
	const [gridApi, setGridApi] = useState<any>();
	const [exportData, setExportData] = useState([]);
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);

	const dispatch = useDispatch<any>();
	const searchText = useSelector(selectSearchText);
	const fileName = useSelector(selectFileName);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns();
		formatHiddenColumns();
		searchParams.forEach((value, key) => {
			if (key === 'searchText') dispatch(setSearchText(value));
		});
	}, [isUpdated]);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows(params: any) {
					const { filterModel } = params;
					const page = params.endRow / TOTAL_RECORDS;
					let filters: any = {};
					for (const key in filterModel) {
						if (filterModel.hasOwnProperty(key)) {
							filters[key] = filterModel[key].filter;
						}
					}
					if (searchText) {
						filters['employeeID'] = searchText;
					}

					setSearchParams({
						...(searchText !== '' && { searchText }),
						fileName: Helper.getFileNameTrainingDashboard(
							true,
							'',
							'',
							searchText
						),
					});

					getData(page || 1, '', filters).then((data: any) => {
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
		setIsUpdated(false);
	}, [gridApi, searchText, isUpdated, TOTAL_RECORDS]);

	const getDataBySearchText = async (searchText: string) => {
		dispatch(setSearchText(searchText));
	};

	const setColumns = () => {
		const columns: any = [];

		normalizedTrainingDetailsTableColumns.forEach((e1) => {
			columns.push({
				field: e1,
				headerName: Helper.formatColumnNames(e1),
				tooltipField: e1,
				hide: TrainingDashboardHiddenColumns.includes(e1),
			});
		});

		setColumnDefs(columns);
	};

	const getData = async (pageNo: number, searchText: string, filters?: any) => {
		let data =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				'normalize',
				pageNo || 1,
				searchText,
				'',
				'',
				filters
			);

		if (data.records?.length) {
			data = formatNormalizeData(data);
			data = Helper.formatDateColumns(data, dateColumns);
		}

		let exportData: any =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				'normalize',
				0,
				searchText,
				'',
				'',
				filters
			);

		if (exportData.records?.length) {
			exportData = formatNormalizeData(exportData);
			exportData = Helper.formatDateColumns(exportData, dateColumns);
			setExportData(exportData.records);
			dispatch(setFileName({ searchText }));
		} else {
			setExportData([]);
		}

		return data;
	};

	const formatNormalizeData = (data: any) => {
		data.records.map((item: any) => {
			let employeeID = item.empId.id;
			if (item.empId) {
				item.name = item.empId.name;
				item.currDesignation = item.empId.currDesignation;
				item.clientName = item.empId.currClient1;
				item.employeeStatus = item.empId.status;
				item.reportingManager = item.empId.reportingTo;
				item.doj = item.empId.doj;
			}
			if (item.batchId) {
				item.headTrainer = item.batchId.headTrainer;
				item.batchTitle = item.batchId.batchTitle;
				item.batchStatus = item.batchId.status;
				item.trainingStartDate = item.batchId.startDate;
				item.trainingEndDate = item.batchId.endDate;
				item.batchTypeDescription = item.batchId.techTopic;
			}
			delete item.empId;
			delete item.batchId;
			item.employeeID = employeeID;
		});
		return data;
	};

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const onShowHiddenColumns = useCallback(
		(gridColumnApi: any, target: any, item: any, hiddenColumns: any) => {
			const data = Helper.showHideGridColumns(
				gridColumnApi,
				target,
				item,
				hiddenColumns,
				gridApi
			);
			setErrorMessage('');
			if (data.errorMsg) {
				setErrorMessage(data.errorMsg);
			} else {
				setHiddenColumns([...data]);
			}
		},
		[]
	);

	const resetHiddenColumns = useCallback(
		(gridColumnApi: any, hiddenColumns: any) => {
			const data = Helper.resetShowHideColumns(
				gridColumnApi,
				hiddenColumns,
				TrainingDashboardHiddenColumns
			);
			setErrorMessage('');
			setHiddenColumns([...data]);
		},
		[]
	);

	const formatHiddenColumns = () => {
		const formatedColumns = normalizedTrainingDetailsTableColumns.map(
			(col: any, key) => {
				return {
					id: key,
					name: col,
					checked: !TrainingDashboardHiddenColumns.includes(col),
					dispayName: Helper.formatColumnNames(col),
				};
			}
		);
		setHiddenColumns(formatedColumns);
	};

	const handleupdated = (isUpdated: boolean) => {
		setIsUpdated(isUpdated);
	};

	return (
		<div>
			<div className="flex justify-between my-8 ml-24">
				<h1 className="font-bold text-3xl ">Training Details</h1>
				<label
					htmlFor="my_modal_7"
					className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
				>
					Add Training Detail
				</label>

				<AddTrainingDetails getIsUpdated={handleupdated} />
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 p-TOTAL_RECORDS bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-between p-3">
					<SearchBox
						defaultValue={searchText}
						placeholder={'Search by employee name…'}
						getDataBySearchText={getDataBySearchText}
					/>
					<ExportToExcel apiData={exportData} fileName={fileName} />
				</div>
				{hiddenColumns && (
					<ShowHideColumns
						hiddenColumns={hiddenColumns}
						gridColumnApi={gridColumnApi}
						onShowHiddenColumns={onShowHiddenColumns}
						resetHiddenColumns={resetHiddenColumns}
						gridApi={gridApi}
						errorMsg={errorMsg}
					/>
				)}
				<div
					className="ag-theme-alpine"
					style={{ height: `${TOTAL_RECORDS > 5 ? '717px' : '420px'}` }}
				>
					<AgGridReact
						columnDefs={columnDefs}
						animateRows={true}
						className="text-base"
						rowModelType={'infinite'}
						pagination={true}
						paginationPageSize={TOTAL_RECORDS}
						cacheBlockSize={TOTAL_RECORDS}
						onGridReady={onGridReady}
					/>
				</div>
			</div>
		</div>
	);
};

export default NormalizeTrainingDetails;
