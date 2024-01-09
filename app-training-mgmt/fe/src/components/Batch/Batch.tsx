import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { batchService } from '../../services/batchService';
import {
	BatchTableColumnNames,
	BatchTableHiddenColumns,
} from '../../constants/constants';
import Sort from '../Common/Sort';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectFileName,
	selectSortColumn,
	selectSortOrder,
	selectStatus,
	selectTech,
	setFileName,
	setSortColumn,
	setSortOrder,
	setStatus,
	setTech,
} from '../../store/features/batchSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function BatchData() {
	const defaultTech = 'Select Tech';
	const defaultStatus = 'Select Status';
	useDocumentTitle('Batches | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [techValues, setTechValues] = useState<string[]>([]);
	const [statusValues, setStatusValues] = useState<string[]>([]);
	const [sortBatches, setSortBatches] = useState<any>([]);
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const dateColumns = ['startDate', 'endDate', 'createdAt', 'updatedAt'];

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const tech = useSelector(selectTech);
	const status = useSelector(selectStatus);
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		getTechValues();
		getStatusValues();
		setColumns();
		formatHiddenColumns();

		searchParams.forEach((value, key) => {
			if (key === 'status') dispatch(setStatus(value));
			if (key === 'tech') dispatch(setTech(value));
			if (key === 'sortColumn') dispatch(setSortColumn(value));
			if (key === 'sortOrder') dispatch(setSortOrder(value));
		});
	}, []);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params: any) => {
					const { filterModel, sortModel } = params;

					const colId =
						sortModel.length && sortModel[0].colId
							? sortModel[0].colId
							: sortColumn;
					const sort =
						sortModel.length && sortModel[0].sort
							? sortModel[0].sort
							: sortOrder;

					setSearchParams({
						...(tech !== '' && { tech }),
						...(status !== '' && { status }),
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameBatch(false, colId, sort, tech, status),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;
					let techFilter = '';
					let statusFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						techFilter += fil === 'tech' ? `${filterModel[fil].filter}` : '';
						statusFilter +=
							fil === 'status' ? `${filterModel[fil].filter}` : '';
					});

					getData(
						page || 1,
						sortModel.length && sortModel[0].colId,
						statusFilter || status,
						techFilter || tech,
						sortModel.length && sortModel[0].sort
					).then((data) => {
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
	}, [gridApi, status, tech, TOTAL_RECORDS]);

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const setColumns = () => {
		const columns: any = [];
		const sortableColumns = BatchTableColumnNames.filter(
			(column) =>
				column !== 'batchTitle' &&
				column !== 'tech' &&
				column !== 'status' &&
				column !== 'isProcessed' &&
				column !== 'updatedAt'
		).map((item) => item);
		setSortBatches(sortableColumns);
		BatchTableColumnNames.forEach((col) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				sortable: sortableColumns.includes(col),
				tooltipField: col,
				hide: BatchTableHiddenColumns.includes(col),
			});
		});
		setColumnDefs(columns);
	};

	const onShowHiddenColumns = useCallback(
		(
			gridColumnApi: any,
			target: any,
			item: any,
			hiddenColumns: any,
			gridApi: any
		) => {
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
			gridApi.sizeColumnsToFit();
		},
		[]
	);

	const resetHiddenColumns = useCallback(
		(gridColumnApi: any, hiddenColumns: any, gridApi: any) => {
			const data = Helper.resetShowHideColumns(
				gridColumnApi,
				hiddenColumns,
				BatchTableHiddenColumns
			);
			setErrorMessage('');
			setHiddenColumns([...data]);
			gridApi.sizeColumnsToFit();
		},
		[]
	);

	const formatHiddenColumns = () => {
		const formatedColumns = BatchTableColumnNames.map((col: any, key) => {
			return {
				id: key,
				name: col,
				checked: !BatchTableHiddenColumns.includes(col),
				dispayName: Helper.formatColumnNames(col),
			};
		});
		setHiddenColumns(formatedColumns);
	};

	const getTechValues = async () => {
		const tempTech = await batchService.getTechForBatches('raw-data', false);
		setTechValues([defaultTech].concat(tempTech));
	};

	const getStatusValues = async () => {
		const tempStatus = await batchService.getStatusForBatches('raw-data');
		setStatusValues([defaultStatus].concat(tempStatus));
	};

	const getData = async (
		page: number,
		sortOption: string,
		status: string,
		tech: string,
		order: string
	) => {
		let data = await batchService.getAllBatchesDataForSort(
			'raw-data',
			page || 1,
			sortOption,
			status,
			tech,
			order
		);

		if (data.records?.length)
			data = Helper.formatDateColumns(data, dateColumns);

		let exportData: any = await batchService.getAllBatchesDataForSort(
			'raw-data',
			0,
			sortOption,
			status,
			tech,
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

	const setSelectedStatus = async (status: string) => {
		status === defaultStatus
			? dispatch(setStatus(''))
			: dispatch(setStatus(status));
	};

	const setSelectedTech = async (tech: string) => {
		tech === defaultTech ? dispatch(setTech('')) : dispatch(setTech(tech));
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Batches</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
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
								options={techValues}
								getSortedData={setSelectedTech}
								defaultValue={tech === '' ? defaultTech : tech}
							/>
						) : null}
					</div>
					<div>
						<Sort
							options={statusValues}
							getSortedData={setSelectedStatus}
							defaultValue={status === '' ? defaultStatus : status}
						/>
					</div>
					<div>
						<ExportToExcel apiData={exportData} fileName={fileName} />
					</div>
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
					style={{
						width: '100%',
						height: `${TOTAL_RECORDS > 5 ? '717px' : '420px'}`,
					}}
				>
					<AgGridReact
						pagination={true}
						rowModelType={'infinite'}
						animateRows={true}
						paginationPageSize={TOTAL_RECORDS}
						cacheBlockSize={TOTAL_RECORDS}
						onGridReady={onGridReady}
						columnDefs={columnDefs}
						className="text-base"
					/>
				</div>
			</div>
		</div>
	);
}

export default BatchData;
