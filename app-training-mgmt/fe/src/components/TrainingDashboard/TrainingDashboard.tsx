import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import {
	TrainingDashboardHiddenColumns,
	TrainingDashboardTableColumnNames,
} from '../../constants/constants';

import SearchBox from '../Common/SearchBox';
import { ExportToExcel } from '../Common/ExportToExcel';
import {
	selectFileName,
	selectSearchText,
	selectSortColumn,
	selectSortOrder,
	setFileName,
	setSearchText,
	setSortColumn,
	setSortOrder,
} from '../../store/features/trainingDashboardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { trainingDashboardService } from '../../services/trainingDashboardService';
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

const TrainingDashboardData = () => {
	useDocumentTitle('Training Details | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState();
	const [gridApi, setGridApi] = useState<any>();
	const [exportData, setExportData] = useState([]);
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const searchText = useSelector(selectSearchText);
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		const columns: any = [];
		const FilteredSortColumns = TrainingDashboardTableColumnNames.filter(
			(value: any) =>
				[
					'doj',
					'trainingStartDate',
					'trainingEndDate',
					'batchType',
					'createdAt',
				].includes(value)
		);

		TrainingDashboardTableColumnNames.forEach((e1) => {
			columns.push({
				field: e1,
				headerName: Helper.formatColumnNames(e1),
				...(FilteredSortColumns.includes(e1) ? { sortable: true } : {}),
				tooltipField: e1,
				hide: TrainingDashboardHiddenColumns.includes(e1),
			});
		});

		setColumnDefs(columns);
		formatHiddenColumns();

		searchParams.forEach((value, key) => {
			if (key === 'searchText') dispatch(setSearchText(value));
			if (key === 'sortColumn') dispatch(setSortColumn(value));
			if (key === 'sortOrder') dispatch(setSortOrder(value));
		});
	}, []);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows(params: any) {
					const { filterModel, sortModel } = params;

					const colId =
						sortModel.length && sortModel[0].colId
							? sortModel[0].colId
							: sortColumn;
					const sort =
						sortModel.length && sortModel[0].sort
							? sortModel[0].sort
							: sortOrder;

					let nameFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						nameFilter += fil === 'name' ? `${filterModel[fil].filter}` : '';
					});

					setSearchParams({
						...(searchText !== '' && { searchText }),
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameTrainingDashboard(
							false,
							colId,
							sort,
							searchText
						),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;

					getData(page || 1, searchText || nameFilter, colId, sort).then(
						(data: any) => {
							gridApi.hideOverlay();
							params.successCallback(data.records, data.totalRecords);
							if (data.records && !data.records.length) {
								gridApi.showNoRowsOverlay();
							}
						}
					);
				},
			};
			gridApi.setDatasource(dataSource);
		}
	}, [gridApi, searchText, TOTAL_RECORDS]);

	const getDataBySearchText = async (searchText: string) => {
		dispatch(setSearchText(searchText));
	};

	const getData = async (
		pageNo: number,
		searchText: string,
		sortOption?: string,
		order?: string
	) => {
		let data =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				'raw-data',
				pageNo || 1,
				searchText,
				sortOption,
				order
			);

		if (data.records?.length)
			data = Helper.formatDateColumns(data, dateColumns);

		let exportData: any =
			await trainingDashboardService.getAllTrainingDashboardDataBySearcAndSort(
				'raw-data',
				0,
				searchText,
				sortOption,
				order
			);

		if (exportData.records?.length) {
			exportData = Helper.formatDateColumns(exportData, dateColumns);
			setExportData(exportData.records);
			dispatch(setFileName({ sortOption, order }));
		} else {
			setExportData([]);
		}

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
		const formatedColumns = TrainingDashboardTableColumnNames.map(
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

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Training Details</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 p-TOTAL_RECORDS bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-between p-3">
					<SearchBox
						defaultValue={searchText}
						placeholder={'Search by name…'}
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

export default TrainingDashboardData;
