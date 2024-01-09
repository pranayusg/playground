import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BaseForm from './BaseForm';
import SignUp from './Signup';
import Header from './Header';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

const Index = () => {
	useDocumentTitle('Training Management');
	const [heading, setHeading] = useState('Enter your CCI ID');
	let [searchParams] = useSearchParams();

	const setPasswordToken = searchParams.get('token');

	useEffect(() => {
		if (setPasswordToken) {
			setHeading(
				`${localStorage.getItem('resetPassword') ? 'Reset' : 'Set'
				} your password`
			);
		} else {
			localStorage.removeItem('resetPassword');
			setHeading('Enter your CCI ID');
		}
	}, [setPasswordToken]);

	return (
		<div className="w-6/12 m-auto mt-32 card border-solid border-2 p-5 bg-base-100 shadow-xl">
			<Header title={heading} />
			{setPasswordToken ? (
				<SignUp setPasswordToken={setPasswordToken} />
			) : (
				<BaseForm />
			)}
		</div>
	);
};

export default Index;
