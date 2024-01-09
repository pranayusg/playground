import { Link } from 'react-router-dom';
import NavBar from '../Menu/Menu';

const Header = ({
	isTrainee,
	isTrainer,
}: {
	isTrainee: boolean;
	isTrainer: boolean;
}) => {
	// location.pathname === '/' || location.pathname === '/login';
	const showMenu = localStorage.getItem('token') ? true : false;

	return (
		<header>
			<div className="nav-area flex justify-between bg-violet-800 text-white">
				<div className="flex w-full">
					<div className="w-80 flex">
						<Link to="/" className="logo text-3xl align-items-center p-2.5">
							Training Management
						</Link>
					</div>
					{showMenu ? (
						<NavBar isTrainee={isTrainee} isTrainer={isTrainer} />
					) : null}
				</div>
			</div>
		</header>
	);
};

export default Header;
