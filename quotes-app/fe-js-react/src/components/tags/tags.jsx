import "./tags.css";
import React, { useEffect, useState } from "react";
import { getAllTags } from "../../apis/openRoutes";

const Tags = (props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchInitial();
	}, []);

	const fetchInitial = async () => {
		const quotesData = await getAllTags();

		setData(quotesData.slice(0, 4));
	};

	const tagClicked = (tagName) => {
		props.displayTagTab(tagName);
	};

	return (
		<div className="sidebar">
			<p>Popular Tags</p>
			<div className="tag-list">
				{data.map((tag, index) => (
					<a
						key={index}
						href="#"
						className="tag-pill"
						onClick={(e) => tagClicked(e.target.innerText)}
					>
						{tag}
					</a>
				))}
			</div>
		</div>
	);
};

export default Tags;
