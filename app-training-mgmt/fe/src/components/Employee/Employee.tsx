import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { employeeService } from '../../services/employeeService';
import {
	EmployeeTableColumnNames,
	EmployeeTableHiddenColumns,
} from '../../constants/constants';
import SearchBox from '../Common/SearchBox';
import { Helper } from '../../utils/helpers';
import { ExportToExcel } from '../Common/ExportToExcel';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectEmployeeType,
	selectFileName,
	selectSearchText,
	selectSortColumn,
	selectSortOrder,
	setEmployeeType,
	setFileName,
	setSearchText,
	setSortColumn,
	setSortOrder,
} from '../../store/features/employeeSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function EmployeeData() {
	const employeeTypes = ['Active', 'Resigned'];
	useDocumentTitle('Employees | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState();
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const dateColumns = [
		'createdAt',
		'currDesignationSince',
		'doj',
		'updatedAt',
		'leavingDate',
	];

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const searchText = useSelector(selectSearchText);
	const employeeType = useSelector(selectEmployeeType) || employeeTypes[0];
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns();
		formatHiddenColumns();
		searchParams.forEach((value, key) => {
			if (key === 'employeeType') dispatch(setEmployeeType(value));
			if (key === 'searchText') dispatch(setSearchText(value));
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
						...(employeeType !== '' && { employeeType }),
						...(searchText !== '' && { searchText }),
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameEmployee(
							false,
							colId,
							sort,
							searchText
						),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;
					let nameFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						nameFilter +=
							fil === 'employee' ? `${filterModel[fil].filter}` : '';
					});

					getEmployeeData(
						employeeType,
						page || 1,
						searchText || nameFilter,
						sortModel.length && sortModel[0].colId,
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
	}, [gridApi, searchText, employeeType, TOTAL_RECORDS]);

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const setColumns = () => {
		const columns: any = [];
		const sortableColumns = [
			'employeeNumber',
			'createdAt',
			'currDesignationSince',
			'currExperience',
			'doj',
		];
		EmployeeTableColumnNames.forEach((col) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				sortable: sortableColumns.includes(col),
				tooltipField: col,
				hide: EmployeeTableHiddenColumns.includes(col),
			});
		});
		setColumnDefs(columns);
	};

	const getEmployeeData = async (
		employeeType: string,
		page: number,
		searchText: string,
		sortOption: string,
		order: string
	) => {
		let data: any;
		data = await employeeService.getEmployees(
			employeeType,
			page || 1,
			searchText,
			sortOption,
			order
		);

		if (data.records?.length) {
			data = Helper.formatDateColumns(data, dateColumns);
		}

		let exportData: any;
		exportData = await employeeService.getEmployees(
			employeeType,
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

	const getDataBySearchText = async (searchText: string) => {
		dispatch(setSearchText(searchText));
	};

	const onEmployeeTypeChange = async (employeeType: string) => {
		dispatch(setEmployeeType(employeeType));
	};

	const onShowHiddenColumns = useCallback(
		(
			gridColumnApi: any,
			target: any,
			item: any,
			hiddenColumns: any,
			gridApi: any
		) => {
			let data = Helper.showHideGridColumns(
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
				EmployeeTableHiddenColumns
			);
			setErrorMessage('');
			setHiddenColumns([...data]);
		},
		[]
	);

	const formatHiddenColumns = () => {
		const formatedColumns = EmployeeTableColumnNames.map((col: any, key) => {
			return {
				id: key,
				name: col,
				checked: !EmployeeTableHiddenColumns.includes(col),
				dispayName: Helper.formatColumnNames(col),
			};
		});
		setHiddenColumns(formatedColumns);
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Employees</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-between mb-4">
					<div className="space-x-5 mb-5 ml-4">
						<span>Employee type</span>
						<select
							className="select select-bordered max-w-xs"
							onChange={(e: any) => onEmployeeTypeChange(e.target.value)}
							name="employeeType"
							defaultValue={employeeType}
						>
							{employeeTypes.map((value: string, index: number) => (
								<option key={index} value={value}>
									{value}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end space-x-4">
						<SearchBox
							defaultValue={searchText}
							placeholder={'Search by Employee name…'}
							getDataBySearchText={getDataBySearchText}
						/>
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
				<div className="bg-white overflow-x-auto">
					<div
						className="ag-theme-alpine"
						style={{
							width: '100%',
							height: `${TOTAL_RECORDS > 5 ? '717px' : '420px'}`,
						}}
					>
						<AgGridReact
							rowModelType={'infinite'}
							onGridReady={onGridReady}
							columnDefs={columnDefs}
							animateRows={true}
							pagination={true}
							paginationPageSize={TOTAL_RECORDS}
							cacheBlockSize={TOTAL_RECORDS}
							className="text-base"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EmployeeData;
