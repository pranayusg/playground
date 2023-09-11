import { useState } from 'react';

export const SideMenu = ({
	setActiveContent,
	setName,
}: React.SetStateAction<any>) => {
	const [activeKey, setActiveKey] = useState(0);
	const menuNames = ['Upload Excel', 'Jobs', 'Training Dashboard', 'Batches'];

	const menuItems = [
		{
			label: menuNames[0],
			key: 1,
			onclick: () => {
				setActiveKey(1);
				setName(menuNames[0]);
				setActiveContent(1);
			},
			// icon: <RiDashboardFill />,
		},
		{
			label: menuNames[1],
			key: 2,
			onclick: () => {
				setActiveKey(2);
				setName(menuNames[1]);
				setActiveContent(2);
			},
		},
		{
			label: menuNames[2],
			key: 3,
			onclick: () => {
				setActiveKey(3);
				setName(menuNames[2]);
				setActiveContent(3);
			},
		},
		{
			label: menuNames[3],
			key: 4,
			onclick: () => {
				setActiveKey(4);
				setName(menuNames[3]);
				setActiveContent(4);
			},
		},
	];

	return (
		<ul className="menu w-80 bg-blue-950 text-white">
			{menuItems.map((menu: any) => (
				<li key={menu.key}>
					<button
						className={`focus:!bg-sky-800 focus:!text-white hover:bg-sky-600 hover:!text-white ${
							menu.key === activeKey ? 'bg-sky-800' : null
						}`}
						onClick={menu.onclick}
					>
						{menu.label}
					</button>
				</li>
			))}
		</ul>
	);
};
