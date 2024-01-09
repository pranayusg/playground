export interface Props {
	hiddenColumns: any;
	onShowHiddenColumns: any;
	resetHiddenColumns: any;
	gridColumnApi: any;
	gridApi: any;
	errorMsg: string;
}

export const ShowHideColumns = ({
	hiddenColumns,
	onShowHiddenColumns,
	resetHiddenColumns,
	gridColumnApi,
	gridApi,
	errorMsg,
}: Props) => {
	return (
		<div
			tabIndex={0}
			className="collapse collapse-arrow border border-base-300 my-3.5"
		>
			<input type="checkbox" className="peer" />
			<div className="collapse-title peer-checked:border">
				Show/hide columns
			</div>
			<div className="collapse-content peer-checked:my-3.5">
				<div className="grid grid-cols-5 gap-4">
					{hiddenColumns &&
						hiddenColumns.map((item: any) => (
							<li key={item.name} className="list-none w-80">
								<p className="flex">
									<input
										type="checkbox"
										checked={item.checked}
										value={item.name}
										className="checkbox"
										onChange={(e: any) =>
											onShowHiddenColumns(
												gridColumnApi,
												e.target,
												item,
												hiddenColumns,
												gridApi
											)
										}
									/>
									<label className="mx-2.5">{item.dispayName}</label>
								</p>
							</li>
						))}
				</div>
				<div className="mt-4 peer-checked:border">
					<button
						className="link link-primary"
						onClick={(e: any) =>
							resetHiddenColumns(gridColumnApi, hiddenColumns, gridApi)
						}
					>
						Reset to Default
					</button>
				</div>
				{errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
			</div>
		</div>
	);
};
