import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';

import {
	normalizedApprovedCertificationTableColumns,
	normalizedAchievedCertificationTableColumns,
	editableAchievedCertificationColumns,
} from '../../constants/constants';
import { Helper } from '../../utils/helpers';
import { ExportToExcel } from '../Common/ExportToExcel';
import { certificationService } from '../../services/certificationService';
import { ShowHideColumns } from '../Common/showHideColumns';
import { gridActions } from '../Common/gridAction';
import {
	selectCertificationData,
	selectCertificationType,
	selectActiveTab,
	setCertificationType,
	setSortColumn,
	setSortOrder,
	setFileName,
	setActiveTab,
} from '../../store/features/normalizedCertificationSlice';
import AddApprovedCertification from './AddApprovedCertification';
import AddAchievedCertification from './AddAchievedCertification';
import { selectNoOfRecords } from '../../store/features/globalSlice';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function NormalizedCertificationData({ isTrainee }: { isTrainee: boolean }) {
	const certificationTypes = ['Approved', 'Achieved'].filter((item) =>
		isTrainee ? item !== 'Approved' : item
	);
	useDocumentTitle('Certifications | Training Management');
	const [columnDefs, setColumnDefs] = useState([]);
	const [gridApi, setGridApi] = useState<any>();
	const [gridColumnApi, setGridColumnApi] = useState<any>();
	const [hiddenColumns, setHiddenColumns] = useState<any>([]);
	const [exportData, setExportData] = useState([]);
	const [tableColumns, setTableColumns] = useState<any>([]);

	const defaultHiddenColumns = ['updatedAt'];
	const tabs = [
		{ name: 'Approved', displayName: 'Certification List' },
		{ name: 'Achieved', displayName: 'Certified Employees' },
	].filter((item) => (isTrainee ? item.name !== 'Approved' : item));
	const [errorMsg, setErrorMessage] = useState<string>('');
	const dateColumns = ['createdAt', 'updatedAt', 'achievedDate', 'expiryDate'];
	const [isUpdated, setIsUpdated] = useState<boolean>(false);

	const dispatch = useDispatch<any>();
	const certification =
		useSelector(selectCertificationType) || certificationTypes[0];
	const certificationType = certification;
	const certificationData = useSelector(selectCertificationData)[
		certificationType
	];
	const activeTab = useSelector(selectActiveTab);
	const fileName = certificationData.fileName;
	const TOTAL_RECORDS = useSelector(selectNoOfRecords);

	useEffect(() => {
		setColumns(gridApi);
		formatHiddenColumns();
	}, [certificationType, isUpdated]);

	useEffect(() => {
		formatHiddenColumns();
	}, [tableColumns]);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params: any) => {
					const { sortModel, filterModel } = params;
					const page = params.endRow / TOTAL_RECORDS;
					let filters: any = {};
					for (const key in filterModel) {
						if (filterModel.hasOwnProperty(key)) {
							filters[key] = filterModel[key].filter;
						}
					}
					const colId =
						sortModel.length && sortModel[0].colId
							? sortModel[0].colId
							: certificationData.sortColumn;
					const sort =
						sortModel.length && sortModel[0].sort
							? sortModel[0].sort
							: certificationData.sortOrder;
					dispatch(setSortColumn(colId));
					dispatch(setSortOrder(sort));

					getCertificationData(
						certificationType,
						page || 1,
						colId,
						sort,
						filters
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
		setIsUpdated(false);
	}, [gridApi, certificationType, isUpdated, TOTAL_RECORDS]);

	const onGridReady = (params: any) => {
		setGridColumnApi(params.columnApi);
		setGridApi(params.api);
	};

	const setColumns = (gridApi: any) => {
		const columns: any = [];

		const tableColumns =
			certificationType === certificationTypes[0] && !isTrainee
				? normalizedApprovedCertificationTableColumns
				: normalizedAchievedCertificationTableColumns.filter((item) =>
					isTrainee ? item !== 'action' : item
				);
		setTableColumns(tableColumns);
		const sortableColumns = [
			'certificationName',
			'createdAt',
			'costInDollars',
			'empId',
			'achievedDate',
			'expiryDate',
		];
		tableColumns.forEach((col: any) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				cellRenderer: function (params: any) {
					return col === 'certificationLink' ? (
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
				sortable: sortableColumns.includes(col),
				tooltipField: col,
				hide: defaultHiddenColumns.includes(col),
				...(col === 'certificationName'
					? { width: 550, suppressSizeToFit: true }
					: {}),
				editable: !isTrainee
					? certificationType === certificationTypes[1]
						? editableAchievedCertificationColumns.includes(col)
						: col !== 'action'
					: false,
				...(col === 'action'
					? { cellRenderer: gridActions, pinned: 'right', width: 150 }
					: ''),
			});
		});
		setColumnDefs(columns);
		if (gridApi) {
			gridApi.sizeColumnsToFit();
			gridColumnApi.applyColumnState({
				defaultState: { sort: null },
			});
		}
	};

	const getCertificationData = async (
		certificationType: string,
		page: number,
		orderBy: string,
		order: string,
		filters: any
	) => {
		let data: any;
		const type = `normalize${certificationType}`;

		data = await certificationService.getCertifications(
			type,
			page,
			orderBy,
			order,
			filters
		);

		if (data.records?.length) {
			data = Helper.formatDateColumns(data, dateColumns);
			data = formatNormalizeData(data);
		}

		let exportData: any;
		exportData = await certificationService.getCertifications(
			type,
			0,
			orderBy,
			order,
			filters
		);

		if (exportData.records?.length) {
			exportData = formatNormalizeData(exportData);
			exportData = Helper.formatDateColumns(exportData, dateColumns);
			setExportData(exportData.records);
			dispatch(setFileName({ orderBy, order }));
		} else {
			setExportData([]);
		}

		return data;
	};

	const formatNormalizeData = (data: any) => {
		data.records.map((item: any) => {
			if (item.empId) {
				item.employeeId = item.empId.id;
				item.name = item.empId.name;
			}
			if (item.exam) {
				item.certification = item.exam.certificationName;
				item.tech = item.exam.tech;
				item.level = item.exam.level;
			}
			delete item.empId;
			delete item.exam;
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
				defaultHiddenColumns
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
			.map((col: any, key: any) => {
				return {
					id: key,
					name: col,
					checked: !defaultHiddenColumns.includes(col),
					dispayName: Helper.formatColumnNames(col),
				};
			});
		setHiddenColumns(formatedColumns);
	};

	const setType = (type: string, key: number) => {
		dispatch(setActiveTab(key));
		dispatch(setCertificationType(type));
	};

	const handleupdated = (isUpdated: boolean) => {
		setIsUpdated(isUpdated);
	};

	const onRowEditing = (params: any) => {
		params.api.refreshCells({
			columns: ['action'],
			rowNodes: [params.node],
			force: true,
		});
	};

	const onRowValueChanged = async (params: any) => {
		let postData = { ...params.data };
		dateColumns.map((item) => {
			postData[item] =
				item === 'expiryDate' && !postData[item]
					? null
					: Helper.formatDate(postData[item]);
		});
		postData.costInDollars = postData.costInDollars || 0;
		const data = await certificationService.updateCertificationData(
			certificationType,
			postData
		);
		if (data.error || data.message) {
			gridApi.undoCellEditing();
			Helper.showToastMessage(data.message, 'error');
		} else {
			Helper.showToastMessage('Record updated successfully', 'success');
		}
	};

	return (
		<div>
			<div className="flex justify-between my-8 ml-24">
				<h1 className="font-bold text-3xl">Certifications</h1>

				{!isTrainee ? (
					<>
						<label
							htmlFor="my_modal_7"
							className="btn mx-16 bg-violet-800 text-white hover:bg-violet-900"
						>
							{certificationType === certificationTypes[0]
								? 'Add Approved certificate'
								: 'Add certified employee'}
						</label>
						{certificationType === certificationTypes[0] ? (
							<AddApprovedCertification getIsUpdated={handleupdated} />
						) : (
							<AddAchievedCertification getIsUpdated={handleupdated} />
						)}
					</>
				) : null}
			</div>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="tabs justify-center">
					{tabs &&
						tabs.map((item: any, key) => (
							<span
								key={item.name}
								className={`tab w-1/3 tab-bordered text-xl font-medium ${activeTab === key ? 'tab-active' : ''
									}`}
								onClick={() => {
									setType(item.name, key);
								}}
							>
								{item.displayName}
							</span>
						))}
				</div>
				<div className="card">
					{!isTrainee ? (
						<div className="flex justify-end mb-4">
							<div className="flex justify-end space-x-4">
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
								editType={'fullRow'}
								onRowEditingStarted={onRowEditing}
								onRowEditingStopped={onRowEditing}
								onRowValueChanged={onRowValueChanged}
								undoRedoCellEditing={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NormalizedCertificationData;
