import "./tags.css";
import React, { useEffect, useState } from "react";
import { getAllTags } from "../../apis/openRoutes";

interface TagsProps {
	displayTagTab: (tagName: string) => void;
}

const Tags = (props: TagsProps) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchInitial();
	}, []);

	const fetchInitial = async () => {
		const quotesData = await getAllTags();

		setData(quotesData.slice(0, 4));
	};

	const tagClicked = (tagName: string) => {
		props.displayTagTab(tagName);
	};

	return (
		<>
			{data.length > 0 && (
				<div className="sidebar">
					<p>Popular Tags</p>
					<div className="tag-list">
						{data.map((tag, index) => (
							<a
								key={index}
								href="#"
								className="tag-pill"
								onClick={(e: any) => tagClicked(e.target.innerText)}
							>
								{tag}
							</a>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default Tags;
