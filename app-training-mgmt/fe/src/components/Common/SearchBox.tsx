import { useRef } from 'react';

interface SearchBoxProps {
	defaultValue: string;
	placeholder: string;
	getDataBySearchText: (searchText: string) => void;
}

const SearchBox = (props: SearchBoxProps) => {
	// const [searchText, setSearchText] = useState(props.defaultValue);
	const inputEl = useRef(null);

	// useEffect(() => {
	// 	setSearchText(props.defaultValue);
	// }, [props]);

	const onSearch = async () => {
		props.getDataBySearchText((inputEl.current as any).value);
	};

	return (
		<div className="form-control">
			<div className="input-group">
				<input
					key={Math.random() + props.defaultValue}
					defaultValue={props.defaultValue}
					ref={inputEl}
					type="text"
					placeholder={props.placeholder}
					className="input input-bordered min-w-[250px]"
				// onChange={(e: any) => setSearchText(e.target.value)}
				/>
				<button className="btn btn-square border border-[#1f2937] border-opacity-20 border-l-0" onClick={() => onSearch()}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default SearchBox;
