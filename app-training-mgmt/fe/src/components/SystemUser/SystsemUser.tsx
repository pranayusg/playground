import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import {
	TOTAL_RECORDS,
	SystemUserTableColumn,
} from '../../constants/constants';
import Sort from '../Common/Sort';
import { Helper } from '../../utils/helpers';
import { systemUserService } from '../../services/systemUserService';
import SearchBox from '../Common/SearchBox';
import { gridActions } from '../Common/gridAction';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function SystemUser() {
	const defaultRole = 'Select role';
	const roles = ['Admin', 'Trainer', 'Trainee'];
	useDocumentTitle('System Users | Training Management');
	const [role, setRole] = useState<string>('');
	const [searchText, setSearchText] = useState<string>('');
	const [columnDefs, setColumnDefs] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	const dateColumns = ['lastLoggedIn'];

	useEffect(() => {
		setColumns(gridApi);
	}, []);

	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params: any) => {
					const { filterModel, sortModel } = params;
					const page = params.endRow / TOTAL_RECORDS;
					let techFilter = '';
					let roleFilter = '';
					const filterKeys = Object.keys(filterModel);
					filterKeys.forEach((fil) => {
						techFilter += fil === 'tech' ? `${filterModel[fil].filter}` : '';
						roleFilter += fil === 'role' ? `${filterModel[fil].filter}` : '';
					});

					getData(
						page || 1,
						sortModel.length && sortModel[0].colId,
						roleFilter || role,
						techFilter || searchText,
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
			gridApi.sizeColumnsToFit();
		}
	}, [gridApi, role, searchText]);

	const onGridReady = (params: any) => {
		setGridApi(params.api);
	};

	const setColumns = (gridApi: any) => {
		const columns: any = [];
		const sortableColumns = SystemUserTableColumn.filter(
			(column) => column !== 'id' && column !== 'name' && column !== 'type'
		).map((item) => item);
		SystemUserTableColumn.forEach((col) => {
			columns.push({
				field: col,
				headerName: Helper.formatColumnNames(col),
				filterParams: { filterOptions: ['contains'] },
				sortable: sortableColumns.includes(col),
				tooltipField: col,
				editable: col === 'type',
				...(col === 'action'
					? { cellRenderer: gridActions, pinned: 'right', width: 150 }
					: ''),
				...(col === 'type'
					? {
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: {
							values: roles,
						},
					}
					: {}),
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
		role: string,
		name: string,
		order: string
	) => {
		let data = await systemUserService.getAllSystemUsers(
			page || 1,
			sortOption,
			order,
			role,
			name
		);
		if (data.records?.length) {
			data = Helper.formatDateTimeColumns(data, dateColumns);
			data = formatNormalizeData(data);
		}

		return data;
	};

	const formatNormalizeData = (data: any) => {
		data.records.map((item: any) => {
			if (item.username) {
				item.id = item.username.id;
				item.name = item.username.name;
			}
			delete item.empId;
		});
		return data;
	};

	const setSelectedRole = (role: string) => {
		role === defaultRole ? setRole('') : setRole(role);
	};

	const getDataBySearchText = (searchText: string) => {
		setSearchText(searchText);
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
				item === 'endDate' && !postData[item]
					? null
					: Helper.formatDate(postData[item]);
		});
		const data: any = await systemUserService.updateSystemUserRole(postData);
		if (data.error) {
			gridApi.undoCellEditing();
			Helper.showToastMessage(data.message[0], 'error');
		} else {
			Helper.showToastMessage('Record updated successfully', 'success');
		}
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">System Users</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				<div className="flex justify-between mb-4">
					<SearchBox
						defaultValue={searchText}
						placeholder={'Search by name…'}
						getDataBySearchText={getDataBySearchText}
					/>
					<div>
						<Sort
							options={[defaultRole].concat(roles)}
							getSortedData={setSelectedRole}
							defaultValue={role === '' ? defaultRole : role}
						/>
					</div>
				</div>
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
						domLayout={'autoHeight'}
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
	);
}

export default SystemUser;
