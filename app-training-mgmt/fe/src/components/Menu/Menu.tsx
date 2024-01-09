import { Link, NavLink, useLocation } from 'react-router-dom';
import store from '../../store';
import { useNavigate } from 'react-router-dom';
import { Helper } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/authService';
import { selectRefreshIntervalId } from '../../store/features/globalSlice';

const NavBar = ({
	isTrainee,
	isTrainer,
}: {
	isTrainee: boolean;
	isTrainer: boolean;
}) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const userName = localStorage.getItem('userName');
	const refreshIntervalId = useSelector(selectRefreshIntervalId);

	const logout = async () => {
		Helper.logout(store, dispatch, navigate, refreshIntervalId);
	};

	const resetPassword = async () => {
		const result = await Helper.getConfirmAlert({
			...Helper.swalPropsChangePassword,
		});
		if (result.isConfirmed) {
			const resetPasswordRes = await authService.changePasswordTokenGenerate();

			if (resetPasswordRes.token) {
				localStorage.setItem('resetPassword', 'true');
				localStorage.removeItem('token');
				navigate(`/?token=${resetPasswordRes.token}`);
			}
		}
	};

	return (
		<nav className="menu h-full inline-block flex-row align-middle flex text-white w-10/12">
			<ul className="flex justify-start space-x-4 w-8/12">
				{!isTrainee ? (
					<li>
						<NavLink
							to="/dashboard"
							className={`${location.pathname.includes('dashboard')
								? 'bg-white text-black'
								: ''
								} py-3 text-base hover:text-white`}
						>
							Dashboard
						</NavLink>
					</li>
				) : null}
				<li>
					<NavLink
						to="/calender"
						className={`${location.pathname.includes('calender')
							? 'bg-white text-black'
							: ''
							} py-3 text-base hover:text-white`}
					>
						Calender
					</NavLink>
				</li>
				<li className="dropdown menu-horizontal">
					<details>
						<summary
							tabIndex={0}
							className={`${location.pathname.includes('normalize')
								? 'bg-white text-black'
								: ''
								} py-3 text-base hover:text-white`}
						>
							Normalized
						</summary>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] text-black menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{!isTrainee && (
								<li>
									<Link to="/normalize/training-Details">Training Details</Link>
								</li>
							)}
							<li>
								<Link to="/normalize/batches">Batches</Link>
							</li>
							{!isTrainee && (
								<li>
									<Link to="/normalize/employees">Employees</Link>
								</li>
							)}
							<li>
								<Link to="/normalize/certifications">Certifications</Link>
							</li>
						</ul>
					</details>
				</li>
				<li className="dropdown">
					<details>
						<summary
							tabIndex={0}
							className={`${location.pathname.includes('assignments')
								? 'bg-white text-black'
								: ''
								} py-3 text-base hover:text-white`}
						>
							Assignments
						</summary>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] text-black menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{!isTrainee && (
								<li>
									<Link to="/assignments/view">View</Link>
								</li>
							)}
							{!isTrainee && (
								<li>
									<Link to="/assignments/batch">Batch</Link>
								</li>
							)}
							<li>
								<Link to="/assignments/feedback">Feedback</Link>
							</li>
						</ul>
					</details>
				</li>
				{!isTrainee && !isTrainer ? (
					<li className="dropdown">
						<details>
							<summary
								tabIndex={0}
								className={`${location.pathname.includes('raw-data')
									? 'bg-white text-black'
									: ''
									} py-3 text-base hover:text-white`}
							>
								Imported-data
							</summary>
							<ul
								tabIndex={0}
								className="dropdown-content z-[1] text-black menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<Link to="/raw-data/import">Import</Link>
								</li>
								<li>
									<Link to="/raw-data/jobs">Jobs</Link>
								</li>
								<li className="z-10">
									<details open>
										<summary>Raw-data</summary>
										<ul>
											<li>
												<Link to="/raw-data/training-details">
													Training Details
												</Link>
											</li>
											<li>
												<Link to="/raw-data/batches">Batches</Link>
											</li>
											<li>
												<Link to="/raw-data/employees">Employees</Link>
											</li>
											<li>
												<Link to="/raw-data/certifications">Certifications</Link>
											</li>
										</ul>
									</details>
								</li>
							</ul>
						</details>
					</li>
				) : null}
				<li>
					<NavLink
						to="/feedback"
						className={`${location.pathname.endsWith('/feedback') &&
							!location.pathname.includes('assignment')
							? 'bg-white text-black'
							: ''
							} py-3 text-base hover:text-white`}
					>
						Feedback
					</NavLink>
				</li>
				{!isTrainee && !isTrainer ? (
					<li>
						<NavLink
							to="/system-user"
							className={`${location.pathname.endsWith('/system-user')
								? 'bg-white text-black'
								: ''
								} py-3 text-base hover:text-white`}
						>
							System-user
						</NavLink>
					</li>
				) : null}
			</ul>
			{userName && (
				<ul className=" flex justify-end w-4/12 menu-horizontal px-1">
					<li className="pt-1">
						<details>
							<summary className="text-base hover:text-white">{userName}</summary>
							<ul className="p-2 text-black shadow z-[1] !mt-0 w-full">
								<li>
									<label htmlFor="my_modal_6" className="">
										Settings
									</label>
								</li>
								<li>
									<button className=" normal-case" onClick={resetPassword}>
										Reset Password
									</button>
								</li>
								<li>
									<button className=" normal-case" onClick={logout}>
										Logout
									</button>
								</li>
							</ul>
						</details>
					</li>
				</ul>
			)}
		</nav>
	);
};

export default NavBar;
