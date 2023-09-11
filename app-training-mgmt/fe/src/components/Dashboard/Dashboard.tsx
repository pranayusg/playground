import { useState } from 'react';
import UploadExcel from '../UploadExcel/UploadExcel';
import { SideMenu } from './Menu';
import TrainingDashboardData from '../TrainingDashboard/TrainingDashboard';
import Jobs from '../Job/Job';
import BatchData from '../Batch/Batch';

function Dashboard() {
	const defaultMenuName = 'Upload Excel';
	const [activeContent, setActiveContent] = useState(1);
	const [name, setName] = useState(defaultMenuName);

	const getContent = () => {
		switch (activeContent) {
			case 1:
				return <UploadExcel />;
			case 2:
				return <Jobs />;
			case 3:
				return <TrainingDashboardData />;
			case 4:
				return <BatchData />;
			default:
				return <UploadExcel />;
		}
	};

	return (
		<div>
			<div className="text-center py-4 text-lg font-semibold bg-blue-950 text-white flex justify-center">
				<img
					src="/logo.png"
					alt="project-logo"
					style={{ height: '30px', width: '30px' }}
					className="mr-2"
				/>
				<p>Training Mangement Dashboard</p>
			</div>
			<div className="content-height flex flex-row">
				<SideMenu setActiveContent={setActiveContent} setName={setName} />
				<div className="bg-slate-300">
					<div className="text-sm breadcrumbs my-4 ml-3 font-medium text-sm">
						<ul>
							<li>
								<span className="text-slate-500 mr-1 ">Dasboard</span> /
								<span className="text-black ml-1">{name}</span>
							</li>
						</ul>
					</div>
					<div className="content-width">{getContent()}</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
