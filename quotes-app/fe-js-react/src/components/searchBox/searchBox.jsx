import "./searchBox.css";
import { useEffect, useState } from "react";
import { AutoComplete, Typography, Space } from "antd";
import { getAuthors } from "../../apis/protectedRoutes";
import Quotes from "../quotes/quotes";

const { Text } = Typography;

const filterAuthors = (searchText, authors) => {
	let optionData = [];
	authors.map((element) => {
		if (
			element.author.toLowerCase().includes(searchText) ||
			element.author.toUpperCase().includes(searchText)
		)
			optionData.push({ value: element.author });
	});

	return optionData;
};

export const SearchBox = (props) => {
	const [authors, setAuthors] = useState([]);

	const [options, setOptions] = useState([]);
	const [searchedAuthor, setSearchedAuthor] = useState(props.authorName);

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

	const onSearch = (searchText) => {
		setOptions(!searchText ? [] : filterAuthors(searchText, authors));
	};

	const onSelect = (data) => {
		setSearchedAuthor(data);
	};

	const onChange = (data) => {
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
			<Quotes type={"Author"} searchedAuthor={searchedAuthor} />
		</div>
	);
};
