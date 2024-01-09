import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { BatchAssignmentTableColumns } from '../../constants/constants';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectFileName,
	selectSortColumn,
	selectSortOrder,
	setFileName,
	setSortColumn,
	setSortOrder,
} from '../../store/features/batchAssignmentSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import AddBatchAssignment from './AddBatchAssignment';
import { assignmentService } from '../../services/assignmnetService';
import { Link, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function BatchAssignment({ isTrainer }: { isTrainer: boolean }) {
	useDocumentTitle('Batch Assignments | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const dateColumns = ['endDate', 'startDate', 'updatedAt', 'createdAt'];
	const [editData, setEditData] = useState<any>();

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);

	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns(gridApi);
		formatHiddenColumns();
		searchParams.forEach((value, key) => {
			if (key === 'sortColumn') dispatch(setSortColumn(value));
			if (key === 'sortOrder') dispatch(setSortOrder(value));
		});
	}, [isUpdated]);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params: any) => {
					const { sortModel } = params;

					const colId =
						sortModel.length && sortModel[0].colId
							? sortModel[0].colId
							: sortColumn;
					const sort =
						sortModel.length && sortModel[0].sort
							? sortModel[0].sort
							: sortOrder;

					setSearchParams({
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameAssignment(
							'Batch-Assignment',
							colId,
							sort,
							'',
							''
						),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;

					getData(page || 1, colId, sort).then((data) => {
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
	}, [gridApi, TOTAL_RECORDS, isUpdated]);

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
						htmlFor="addBatchAssignmentModal"
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
		const sortableColumns = BatchAssignmentTableColumns.filter(
			(column) => column === 'startDate' || column === 'endDate'
		).map((item) => item);
		BatchAssignmentTableColumns.forEach((col) => {
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

	const getData = async (page: number, sortOption: string, order: string) => {
		let data = await assignmentService.getBatchAssignmentOutline(
			page || 1,
			sortOption,
			order
		);

		if (data.records?.length) {
			data = Helper.formatDateColumns(data, dateColumns);
			data = formatResponseData(data, false);
		}

		let exportData: any = await assignmentService.getBatchAssignmentOutline(
			0,
			sortOption,
			order
		);

		if (exportData.records?.length) {
			exportData = Helper.formatDateColumns(exportData, dateColumns);
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
			if (item.batchId) {
				item.batchTitle = item.batchId.batchTitle;
				item.headTrainer = item.batchId.headTrainer;
				item.status = item.batchId.status;
				item.techTopic = item.batchId.techTopic;
			}
			if (item.assignmentOutlineId) {
				item.ratings = Object.values(item.assignmentOutlineId.ratingKeys).join(
					', '
				);
				item.assignmentTopic = item.assignmentOutlineId.topic;
				item.duration = item.assignmentOutlineId.duration;
				item.link = item.assignmentOutlineId.link;
			}
			if (exportData) {
				delete item.assignmentOutlineId;
				delete item.batchId;
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
		const formatedColumns = BatchAssignmentTableColumns.filter(
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

	const handleUpdate = (isUpdated: boolean) => {
		setIsUpdated(true);
	};

	const resetUpdateData = () => {
		setEditData(null);
	};

	return (
		<div>
			<div className="flex justify-between my-8 ml-24">
				<h1 className="font-bold text-3xl">Batch Assignments</h1>
				<label
					htmlFor="addBatchAssignmentModal"
					className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
				>
					Add Batch Assignment
				</label>

				<AddBatchAssignment
					getIsUpdated={handleUpdate}
					updateData={editData}
					resetUpdateData={resetUpdateData}
					isTrainer={isTrainer}
				/>
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-end mb-4">
					<div className="flex space-x-4">
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

export default BatchAssignment;
