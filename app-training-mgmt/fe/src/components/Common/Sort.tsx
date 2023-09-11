interface SortProps {
	options: string[];
	defaultValue?: string;
	defaultOption?: string;
	getSortedData: (sortBy: string) => void;
}

const Sort = (props: SortProps) => {
	const onSortClick = (sortBy: string) => {
		props.getSortedData(sortBy);
	};

	return (
		<div className="flex flex-row">
			<div className="m-auto w-2/4">
				{/* <img
					src="/filter.png"
					alt="filter"
					style={{ height: '30px', width: '30px' }}
					className="mr-2"
				/> */}
			</div>
			<select
				className="select select-primary max-w-xs"
				onChange={(e: any) => onSortClick(e.target.value)}
				defaultValue={props.defaultValue}
			>
				{props.defaultOption ? (
					<option selected>{props.defaultOption}</option>
				) : null}
				{props.options.map((option: string, index: number) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

export default Sort;
