import "./searchBox.css";
import { useEffect, useState } from "react";
import { AutoComplete, Typography, Space } from "antd";
import { getAuthors } from "../../apis/protectedRoutes";
import Quotes from "../quotes/quotes";

interface SearchBoxProps {
	authorName: string;
}

interface Author {
	author: string;
}

const { Text } = Typography;

const filterAuthors = (searchText: string, authors: Author[]) => {
	let optionData: { value: any }[] = [];
	authors.map((element: Author) => {
		if (
			element.author.toLowerCase().includes(searchText) ||
			element.author.toUpperCase().includes(searchText)
		)
			optionData.push({ value: element.author });
	});

	return optionData;
};

export const SearchBox = (props: SearchBoxProps) => {
	const [authors, setAuthors] = useState<Author[]>([]);

	const [options, setOptions] = useState<Array<{ value: string }>>([]);
	const [searchedAuthor, setSearchedAuthor] = useState(
		props.authorName ? props.authorName : ""
	);

	console.log(searchedAuthor);
	useEffect(() => {
		fetchInitial();
	}, []);

	useEffect(() => {
		setSearchedAuthor(props.authorName);
	}, [props]);

	const fetchInitial = async () => {
		let response = await getAuthors();
		setAuthors(response);
	};

	const onSearch = (searchText: string) => {
		setOptions(!searchText ? [] : filterAuthors(searchText, authors));
	};

	const onSelect = (data: string) => {
		setSearchedAuthor(data);
	};

	const onChange = (data: string) => {
		data == undefined ? setSearchedAuthor("") : setSearchedAuthor(data);
	};

	return (
		<div>
			<div className="center">
				<Text
					strong
					style={{
						fontSize: "15px",
						paddingRight: "1%",
					}}
				>
					Search by author{" "}
				</Text>
				<AutoComplete
					defaultValue={""}
					value={searchedAuthor}
					allowClear
					options={options}
					style={{
						width: 250,
						marginBottom: "5%",
					}}
					onSelect={onSelect}
					onChange={onChange}
					onSearch={onSearch}
					placeholder="Author name"
				/>
			</div>
			<Quotes
				key={searchedAuthor}
				type={"Author"}
				searchedAuthor={searchedAuthor}
			/>
		</div>
	);
};
