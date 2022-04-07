import "../tags/tags.css";
import React, { useEffect, useState } from "react";
import { getAuthors } from "../../apis/protectedRoutes";

const Authors = (props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchInitial();
	}, []);

	const fetchInitial = async () => {
		const authors = [];
		const authorsData = await getAuthors();
		authorsData.map((element, index) => {
			if (index < 4) authors.push(element.author);
		});
		setData(authors);
	};

	const authorClicked = (author) => {
		props.displayAuthorTab(author);
	};

	return (
		<div className="sidebar">
			<p>Popular Authors</p>
			<div className="tag-list">
				{data.map((tag, index) => (
					<a
						key={index}
						href="#"
						className="tag-pill"
						onClick={(e) => authorClicked(e.target.innerText)}
					>
						{tag}
					</a>
				))}
			</div>
		</div>
	);
};

export default Authors;
