import "../tags/tags.css";
import React, { useEffect, useState } from "react";
import { getAuthors } from "../../apis/protectedRoutes";

interface AuthorsProps {
	displayAuthorTab: (author: string) => void;
}

const Authors = (props: AuthorsProps) => {
	const [data, setData] = useState<Array<string>>([]);

	useEffect(() => {
		fetchInitial();
	}, []);

	const fetchInitial = async () => {
		const authors: Array<string> = [];
		const authorsData = await getAuthors();
		authorsData.map((element: { author: string }, index: number) => {
			if (index < 4) authors.push(element.author);
		});
		setData(authors);
	};

	const authorClicked = (author: string) => {
		props.displayAuthorTab(author);
	};

	return (
		<>
			{data.length > 0 && (
				<div className="sidebar">
					<p>Popular Authors</p>
					<div className="tag-list">
						{data.map((tag, index) => (
							<a
								key={index}
								href="#"
								className="tag-pill"
								onClick={(e: any) => authorClicked(e.target.innerText)}
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

export default Authors;
