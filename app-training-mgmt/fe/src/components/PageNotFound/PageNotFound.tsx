import { Link } from 'react-router-dom';
import {
	POST_LOGIN_ROUTE,
	POST_LOGIN_ROUTE_TRAINEE,
} from '../../constants/constants';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function PageNotFound() {
	useDocumentTitle('Page Not Found | Training Management');
	return (
		<div className="w-6/12 m-auto mt-32 card border-solid border-2 p-5 bg-base-100 shadow-xl">
			<h1 className="font-bold text-6xl text-center mb-4">404</h1>
			<p className="text-center">
				Oops! This page doesn't exist{' '}
				<Link
					to={
						localStorage.getItem('role') === 'Trainee'
							? POST_LOGIN_ROUTE_TRAINEE
							: POST_LOGIN_ROUTE
					}
					className="block link no-underline hover:underline text-violet-700 mt-4"
				>
					Come back home
				</Link>
			</p>
		</div>
	);
}

export default PageNotFound;
