import { useState } from 'react';
import { authService } from '../../services/authService';
import { Helper } from '../../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from './Form';

const BaseForm = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [loader, setLoader] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const onSubmit = async (data: any) => {
		setLoader(true);
		if (errorMsg) setErrorMsg('');

		const loginResp = await authService.login({ username: data.CCI_ID });
		setLoader(false);
		if (loginResp.status === 400 && loginResp.data.message)
			setErrorMsg(loginResp.data.message);
		else {
			localStorage.setItem('CCI_ID', data.CCI_ID);

			if (loginResp.message === 'User present')
				navigate({ pathname: '/login', search: location.search });
			else await Helper.getConfirmAlert({ ...Helper.swalPropsEmailSent });
		}
	};

	return <Form onSubmit={onSubmit} errorMsg={errorMsg} loader={loader} />;
};

export default BaseForm;
