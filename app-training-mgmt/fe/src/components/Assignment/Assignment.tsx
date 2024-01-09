import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { AssignmentTableColumns } from '../../constants/constants';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectFileName,
	selectSortColumn,
	selectSortOrder,
	selectSearchTech,
	setFileName,
	setSortColumn,
	setSortOrder,
	setSearchTech,
} from '../../store/features/viewAssignmentSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import Sort from '../Common/Sort';
import AddAssignment from './AddAssignment';
import { assignmentService } from '../../services/assignmnetService';
import { Link, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function Assignment() {
	const defaultTech = 'Select Tech';
	useDocumentTitle('View Assignments | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const [techValues, setTechValues] = useState<string[]>([]);
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const [editData, setEditData] = useState<any>();

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const tech = useSelector(selectSearchTech);
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		getTechValues();
		setColumns(gridApi);
		formatHiddenColumns();
		searchParams.forEach((value, key) => {
			if (key === 'tech') dispatch(setSearchTech(value));
			if (key === 'sortColumn') dispatch(setSortColumn(value));
			if (key === 'sortOrder') dispatch(setSortOrder(value));
		});
	}, [isUpdated]);

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
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameAssignment(
							'Assignment',
							colId,
							sort,
							tech,
							''
						),
					});

					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;
					let techFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						techFilter += fil === 'tech' ? `${filterModel[fil].filter}` : '';
					});

					getData(page || 1, colId, techFilter || tech, sort).then((data) => {
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
	}, [gridApi, tech, TOTAL_RECORDS, isUpdated]);

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const editRowData = (params: any) => {
		const buttonClicked = (params: any) => {
			setEditData(params.data);
		};
		return (
			<div>
				<button onClick={() => buttonClicked(params)}>
					<label
						className="btn my-1 bg-transparent border-transparent"
						htmlFor="addAssignmentModal"
					>
						<svg
							className="w-10/12 h-5"
							fill="#000000"
							version="1.1"
							id="Capa_1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 528.899 528.899"
						>
							<path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path>
						</svg>
					</label>
				</button>
			</div>
		);
	};

	const setColumns = (gridApi: any) => {
		const columns: any = [];
		const sortableColumns = AssignmentTableColumns.filter(
			(column) => column === 'duration'
		).map((item) => item);
		AssignmentTableColumns.forEach((col) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				sortable: sortableColumns.includes(col),
				tooltipField: col,
				cellRenderer: function (params: any) {
					return col === 'link' ? (
						<Link
							className="link link-primary"
							to={params.value}
							target="_blank"
						>
							Link
						</Link>
					) : (
						params.value
					);
				},
				...(col === 'action'
					? {
						cellRenderer: editRowData,
						pinned: 'right',
						width: 140,
					}
					: ''),
			});
		});
		setColumnDefs(columns);
		if (gridApi) {
			gridApi.sizeColumnsToFit();
		}
	};

	const getTechValues = async () => {
		const data: any = await assignmentService.getAllTech(0, 'name', '', 'asc');
		const tech = data.records.map((item: any) => {
			return item.name;
		});
		setTechValues([defaultTech].concat(tech));
	};

	const getData = async (
		page: number,
		sortOption: string,
		tech: string,
		order: string
	) => {
		let data = await assignmentService.getAssignmentOutline(
			page || 1,
			sortOption,
			tech,
			order
		);

		if (data.records?.length) data = formatResponseData(data, false);

		let exportData: any = await assignmentService.getAssignmentOutline(
			0,
			sortOption,
			tech,
			order
		);

		if (exportData.records?.length) {
			exportData = formatResponseData(exportData, true);
			setExportData(exportData.records);
			dispatch(setFileName({ sortOption, order }));
		} else {
			setExportData([]);
		}

		return data;
	};

	const formatResponseData = (data: any, exportData: boolean) => {
		data.records.map((item: any) => {
			item.ratings = Object.values(item.ratingKeys).join(', ');
			if (item.techTrainingId) {
				item.trainingTopic = item.techTrainingId.description;
				item.trainingDescription = item.techTrainingId.topic;
				item.tech = item.techTrainingId.techId.name;
			}
			if (exportData) {
				delete item.techTrainingId;
				delete item.ratingKeys;
			}
			return item;
		});
		return data;
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
				[]
			);
			setErrorMessage('');
			setHiddenColumns([...data]);
			gridApi.sizeColumnsToFit();
		},
		[]
	);

	const formatHiddenColumns = () => {
		const formatedColumns = AssignmentTableColumns.filter(
			(item: any) => item !== 'action'
		).map((col: any, key) => {
			return {
				id: key,
				name: col,
				checked: true,
				dispayName: Helper.formatColumnNames(col),
			};
		});
		setHiddenColumns(formatedColumns);
	};

	const setSelectedTech = async (tech: string) => {
		tech === defaultTech
			? dispatch(setSearchTech(''))
			: dispatch(setSearchTech(tech));
	};

	const handleUpdate = (isUpdated: boolean) => {
		setIsUpdated(true);
	};

	const resetUpdateData = () => {
		setEditData(null);
	};

	return (
		<div>
			<div className="flex justify-between my-8 ml-24">
				<h1 className="font-bold text-3xl">View Assignments</h1>
				<label
					htmlFor="addAssignmentModal"
					className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
				>
					Add Assignment
				</label>

				<AddAssignment
					getIsUpdated={handleUpdate}
					updateData={editData}
					resetUpdateData={resetUpdateData}
				/>
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-end mb-4">
					<div className="flex space-x-4">
						<div>
							<Sort
								options={techValues}
								getSortedData={setSelectedTech}
								defaultValue={tech === '' ? defaultTech : tech}
							/>
						</div>
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

export default Assignment;
