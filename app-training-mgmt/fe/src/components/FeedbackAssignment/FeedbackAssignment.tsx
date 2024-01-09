import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { FeedbackAssignmentTableColumns } from '../../constants/constants';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectFileName,
	selectSortColumn,
	selectSortOrder,
	selectSearchEmployee,
	selectStatus,
	setFileName,
	setSortColumn,
	setSortOrder,
	setSearchEmployee,
	setStatus,
} from '../../store/features/feedbackAssignmentSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import Sort from '../Common/Sort';
import { assignmentService } from '../../services/assignmnetService';
import AddFeedbackAssignment from './AddFeedbackAssignment';
import SearchBox from '../Common/SearchBox';
import { Link, useSearchParams } from 'react-router-dom';
import RatingsPopupRenderer from './RatingsPopup';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function FeedbackAssignment({ isTrainee }: { isTrainee: boolean }) {
	const defaultStatus = 'Select Status';
	useDocumentTitle('Assignment Feedback | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const dateColumns = ['submissionDate', 'createdAt', 'updatedAt'];
	const statusArray = [defaultStatus].concat(['Pending', 'Submitted']);
	const [editData, setEditData] = useState<any>();
	const tableColumns = isTrainee
		? FeedbackAssignmentTableColumns.filter((item) => item !== 'action')
		: FeedbackAssignmentTableColumns;

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const status = useSelector(selectStatus);
	const searchEmployee = useSelector(selectSearchEmployee);
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns(gridApi);
		formatHiddenColumns();

		searchParams.forEach((value, key) => {
			if (key === 'status') dispatch(setStatus(value));
			if (key === 'searchEmployee') dispatch(setSearchEmployee(value));
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
						...(searchEmployee !== '' && { searchEmployee }),
						...(status !== '' && { status }),
						...(colId !== '' && { sortColumn: colId }),
						...(sort !== '' && { sortOrder: sort }),
						fileName: Helper.getFileNameAssignment(
							'Assignment-Feedback',
							colId,
							sort,
							searchEmployee,
							status
						),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;

					getData(page || 1, colId, searchEmployee, status, sort).then(
						(data) => {
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
		setIsUpdated(false);
	}, [gridApi, searchEmployee, status, TOTAL_RECORDS, isUpdated]);

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
						htmlFor="addAssignmentFeedbackModal"
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
		const sortableColumns = tableColumns
			.filter((column) => column === 'submissionDate')
			.map((item) => item);
		tableColumns.forEach((col) => {
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
				...(col === 'ratings' ? { cellRenderer: RatingsPopupRenderer } : ''),
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

	const getData = async (
		page: number,
		sortOption: string,
		employee: string,
		status: string,
		order: string
	) => {
		let data = await assignmentService.getFeedbackAssignment(
			page || 1,
			sortOption,
			employee,
			status,
			order
		);

		if (data.records?.length) {
			data = Helper.formatDateColumns(data, dateColumns);
			data = formatResponseData(data, false);
		}

		let exportData: any = await assignmentService.getFeedbackAssignment(
			0,
			sortOption,
			employee,
			status,
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
			if (item.empId) {
				item.employeeId = item.empId.id;
				item.name = item.empId.name;
				item.currClient1 = item.empId.currClient1;
				item.reportingTo = item.empId.reportingTo;
			}
			if (
				item.batchAssignmentOutlineId &&
				item.batchAssignmentOutlineId.assignmentOutlineId
			) {
				const assignment = item.batchAssignmentOutlineId.assignmentOutlineId;
				item.assignmentTopic = assignment.topic;
				item.duration = assignment.duration;
				item.link = assignment.link;
			}
			item.overallRatingComment = item.overallRating;
			item.miscComment = item.comment;
			item.rating = item.ratings;
			let ratingData: any = '';
			Object.keys(item.ratings).forEach((rating: any, index: number) => {
				ratingData += `${rating}: ${item.ratings[rating]}, `;
			});
			item.ratings = ratingData;
			if (exportData) {
				delete item.batchAssignmentOutlineId;
				delete item.empId;
				delete item.rating;
				delete item.overallRating;
				delete item.comment;
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
		const formatedColumns = tableColumns
			.filter((item: any) => item !== 'action')
			.map((col: any, key) => {
				return {
					id: key,
					name: col,
					checked: true,
					dispayName: Helper.formatColumnNames(col),
				};
			});
		setHiddenColumns(formatedColumns);
	};

	const setSelectedStatus = async (status: string) => {
		status === defaultStatus
			? dispatch(setStatus(''))
			: dispatch(setStatus(status));
	};

	const getDataBySearchText = async (searchText: string) => {
		dispatch(setSearchEmployee(searchText));
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
				<h1 className="font-bold text-3xl">Assignment Feedback</h1>
				{!isTrainee ? (
					<>
						<label
							htmlFor="addAssignmentFeedbackModal"
							className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
						>
							Add Assignment Feedback
						</label>
						<AddFeedbackAssignment
							getIsUpdated={handleUpdate}
							updateData={editData}
							resetUpdateData={resetUpdateData}
						/>
					</>
				) : null}
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-end mb-4">
					<div className="flex space-x-4">
						<div>
							<Sort
								options={statusArray}
								getSortedData={setSelectedStatus}
								defaultValue={status === '' ? defaultStatus : status}
							/>
						</div>
						{!isTrainee ? (
							<>
								<SearchBox
									defaultValue={searchEmployee}
									placeholder={'Search by Employee name…'}
									getDataBySearchText={getDataBySearchText}
								/>
								<ExportToExcel apiData={exportData} fileName={fileName} />
							</>
						) : null}
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

export default FeedbackAssignment;
