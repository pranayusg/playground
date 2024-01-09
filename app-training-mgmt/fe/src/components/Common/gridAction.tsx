export const gridActions = (params: any) => {
	let editingCells = params.api.getEditingCells();
	let isCurrentRowEditing = editingCells.some((cell: any) => {
		return cell.rowIndex === params.node.rowIndex;
	});

	const buttonClicked = async (params: any) => {
		params.api.startEditingCell({
			rowIndex: params.node.rowIndex,
			colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
		});
	};

	const onCancel = (params: any) => {
		params.api.stopEditing(true);
		editingCells = [];
		isCurrentRowEditing = false;
	};

	const onUpdate = (params: any) => {
		params.api.stopEditing(false);
		editingCells = [];
		isCurrentRowEditing = false;
	};

	return (
		<span>
			{isCurrentRowEditing ? (
				<div>
					<button
						onClick={() => onUpdate(params)}
						className="action-button update"
						data-action="update"
					>
						Update
					</button>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<button
						onClick={() => onCancel(params)}
						className="action-button cancel"
						data-action="cancel"
					>
						Cancel
					</button>
				</div>
			) : (
				<div>
					<button
						className="btn my-1 bg-transparent border-transparent"
						onClick={() => buttonClicked(params)}
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
					</button>
				</div>
			)}
		</span>
	);
};
