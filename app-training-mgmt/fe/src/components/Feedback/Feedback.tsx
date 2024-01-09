import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';

import { TraineeFeedbackTableColumns } from '../../constants/constants';
import { ExportToExcel } from '../Common/ExportToExcel';
import { Helper } from '../../utils/helpers';
import { ShowHideColumns } from '../Common/showHideColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectFileName,
	selectSortColumn,
	selectSortOrder,
	selectParentBatch,
	selectChildBatch,
	setFileName,
	setSortColumn,
	setSortOrder,
	setParentBatch,
	setChildBatch,
} from '../../store/features/traineeFeedbackSlice';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { feedbackTraineesService } from '../../services/feedbackTraineesService';
import GenerateFeedbackForm from './GenerateFeedbackForm';
import { batchService } from '../../services/batchService';
import ViewTraineeFeedbackResponse from './ViewTraineeFeedbackResponse';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function Feedback({
	isTrainee,
	isTrainer,
}: {
	isTrainee: boolean;
	isTrainer: boolean;
}) {
	const defaultBatch = 'Select Batch';
	useDocumentTitle('Feedback | Training Management');
	const [searchParams, setSearchParams] = useSearchParams();
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [errorMsg, setErrorMessage] = useState<string>('');
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const dateColumns = ['startDate', 'endDate', 'updatedAt'];
	const [batches, setBatches] = useState<any[]>([]);
	const [feedbackData, setFeedbackData] = useState<any>();

	//Dispatch actions
	const dispatch = useDispatch<any>();
	const parentBatch = useSelector(selectParentBatch);
	const childBatch = useSelector(selectChildBatch);
	const fileName = useSelector(selectFileName);
	const sortColumn = useSelector(selectSortColumn);
	const sortOrder = useSelector(selectSortOrder);
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns(gridApi);
		formatHiddenColumns();
		getBatchTree();
		searchParams.forEach((value, key) => {
			if (key === 'parentBatch') dispatch(setParentBatch(value));
			if (key === 'childBatch') dispatch(setChildBatch(value));
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
					const parentBatchTopic = parentBatch.techTopic;
					const childBatchTopic = childBatch && childBatch.techTopic;
					setSearchParams({
						...(parentBatchTopic !== '' && { parentBatchTopic }),
						...(childBatchTopic !== '' && { childBatchTopic }),
						fileName: Helper.getFileNameTraineeFeedback(
							parentBatchTopic,
							childBatchTopic
						),
					});
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					const page = params.endRow / TOTAL_RECORDS;
					const batchId = childBatch ? childBatch.id : parentBatch.id;

					getData(page || 1, colId, batchId, sort).then((data) => {
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
	}, [gridApi, TOTAL_RECORDS, isUpdated, parentBatch, childBatch]);

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const setColumns = (gridApi: any) => {
		const columns: any = [];
		TraineeFeedbackTableColumns.forEach((col) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				tooltipField: col,
				...(col === 'feedback'
					? {
						cellRenderer: viewFeedbackData,
					}
					: ''),
			});
		});
		setColumnDefs(columns);
		if (gridApi) {
			gridApi.sizeColumnsToFit();
		}
	};

	const viewFeedbackData = (params: any) => {
		const buttonClicked = (params: any) => {
			setFeedbackData(params.data);
		};
		return (
			<div>
				<button onClick={() => buttonClicked(params)}>
					<label
						className="link link-primary my-1 bg-transparent border-transparent"
						htmlFor="viewTraineeFeedbackResponse"
					>
						View Feeback
					</label>
				</button>
			</div>
		);
	};

	const getData = async (
		page: number,
		sortOption: string,
		batchId: string,
		order: string
	) => {
		let data = await feedbackTraineesService.getTraineesFeedback(
			page || 1,
			sortOption,
			batchId,
			order
		);

		if (data.records?.length) {
			data = formatResponseData(data);
			data = Helper.formatDateColumns(data, dateColumns);
		}

		let exportData: any = await feedbackTraineesService.getTraineesFeedback(
			0,
			sortOption,
			batchId,
			order
		);

		if (exportData.records?.length) {
			exportData = formatResponseData(exportData);
			exportData = Helper.formatDateColumns(exportData, dateColumns);
			setExportData(exportData.records);
			dispatch(setFileName({ sortOption, order }));
		} else {
			setExportData([]);
		}

		return data;
	};

	const formatResponseData = (data: any) => {
		data.records.map((item: any) => {
			if (item.empId) {
				item.employeeId = item.empId.id;
				item.name = item.empId.name;
				item.currClient1 = item.empId.currClient1;
				item.currDesignation = item.empId.currDesignation;
			}
			if (item.batchId) {
				item.techTopic = item.batchId.techTopic;
				item.headTrainer = item.batchId.headTrainer;
				item.startDate = item.batchId.startDate;
				item.endDate = item.batchId.endDate;
			}
			if (item.questionId) {
				item.question = item.questionId.questionText;
			}
			item.answer = item.answerText;

			if (item.answerOptionId) {
				item.answer = item.answerOptionId.optionText;
			}
			item.feedbackData = item.feedback;
			delete item.empId;
			delete item.questionId;
			delete item.batchId;
			delete item.answerOptionId;
			delete item.batchAssignmentOutlineId;
			delete item.feedback;
			return item;
		});
		return data;
	};

	const getBatchTree = async () => {
		if (!isTrainee) {
			const data = await batchService.getBatchTree(isTrainer ? true : false);
			let batchesArray: any = [];
			data.filter(
				(item: any) =>
					item.status === 'Completed' &&
					!item.headTrainer.includes('Self Learning')
			);
			setBatches(data);
		}
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
		const formatedColumns = TraineeFeedbackTableColumns.map((col: any, key) => {
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

	const onParentBatchChange = async (batch: any) => {
		batch === defaultBatch
			? dispatch(setParentBatch(''))
			: dispatch(setParentBatch(JSON.parse(batch)));
		dispatch(setChildBatch(''));
	};

	const onChildBatchChange = async (batch: any) => {
		batch === defaultBatch
			? dispatch(setChildBatch(''))
			: dispatch(setChildBatch(JSON.parse(batch)));
	};

	return (
		<div>
			<div className="flex justify-between my-8 ml-24">
				<h1 className="font-bold text-3xl">Feedback</h1>
				<ViewTraineeFeedbackResponse feedbackData={feedbackData} />
				{!isTrainee ? (
					<>
						<label
							htmlFor="generateFeedbackFormModal"
							className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
						>
							Generate feedback form
						</label>
						<GenerateFeedbackForm
							getIsUpdated={handleUpdate}
							isTrainer={isTrainer}
						/>
					</>
				) : null}
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				{!isTrainee ? (
					<div className="flex justify-end mb-4">
						<select
							id="batch"
							onChange={(e: any) => onParentBatchChange(e.target.value)}
							className={`select input-bordered w-1/5 mr-2.5 p-2`}
							value={JSON.stringify(parentBatch)}
						>
							<option value={defaultBatch}>Select Batch</option>
							{batches.map((batch) => (
								<option key={batch.id} value={JSON.stringify(batch)}>
									{batch.techTopic}
								</option>
							))}
						</select>
						{parentBatch && parentBatch.children.length ? (
							<select
								id="batch"
								value={JSON.stringify(childBatch)}
								onChange={(e: any) => onChildBatchChange(e.target.value)}
								className={`select input-bordered w-1/5 mr-2.5 p-2`}
							>
								<option value={defaultBatch}>Select Child Batch</option>
								{parentBatch.children.map((batch: any) => (
									<option key={batch.id} value={JSON.stringify(batch)}>
										{batch.techTopic}
									</option>
								))}
							</select>
						) : null}
						<div className="flex space-x-4">
							<ExportToExcel apiData={exportData} fileName={fileName} />
						</div>
					</div>
				) : null}

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

export default Feedback;
