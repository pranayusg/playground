import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthGuard = ({ component }: any) => {
	const [status, setStatus] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		checkToken();
	}, [component]);

	const checkToken = () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				navigate({
					pathname: '/',
					search: `redirect=${location.pathname}${location.search}`,
				});
			}
			setStatus(true);
			return;
		} catch (error) {
			navigate({
				pathname: '/',
				search: `redirect=${location.pathname}${location.search}`,
			});
		}
	};

	return status ? <>{component}</> : <></>;
};

export default AuthGuard;
