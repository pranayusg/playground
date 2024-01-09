import { useState } from 'react';

function Stats({ title, value, list }: any) {
	const [isShown, setIsShown] = useState(false);

	return (
		<div
			title="container"
			onMouseEnter={() => setIsShown(true)}
			onMouseLeave={() => setIsShown(false)}
			className="relative"
		>
			<div className="stats w-full shadow-lg hover:shadow-2xl mt-2 relative hover:bottom-1.5 hover:cursor-pointer">
				<div className="stat text-center">
					<div className="stat-title ">{title}</div>
					<div className={`stat-value  text-primary`}>{value}</div>
				</div>
			</div>
			{list.length ?
				<ul
					className={`${isShown ? '' : 'hidden'
						}  list-categories bg-white absolute top-24 right-0 w-3/4 border-solid border-2 rounded-md`}
				>
					{list.map((item: string, index: number) => (
						<li key={index} className="py-1 px-2 hover:bg-slate-200">
							{index !== 0 ? <hr /> : null}
							{item}
						</li>
					))}
				</ul>
				: null}

		</div>
	);
}

export default Stats;
