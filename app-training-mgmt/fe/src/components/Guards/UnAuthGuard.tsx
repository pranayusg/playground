import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	POST_LOGIN_ROUTE,
	POST_LOGIN_ROUTE_TRAINEE,
} from '../../constants/constants';

const UnAuthGuard = ({ component }: any) => {
	const [status, setStatus] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		checkToken();
	}, [component]);

	const checkToken = () => {
		const token = localStorage.getItem('token');
		if (!token) {
			setStatus(true);
		} else {
			navigate(
				localStorage.getItem('role') === 'Trainee'
					? POST_LOGIN_ROUTE_TRAINEE
					: POST_LOGIN_ROUTE
			);
		}
	};

	return status ? <>{component}</> : <></>;
};

export default UnAuthGuard;
