import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import ShowHidePasswordBtn from '../Common/ShowHidePassword';
import { DevTool } from '@hookform/devtools';
import { authService } from '../../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helper } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectRefreshIntervalId } from '../../store/features/globalSlice';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

type FormValues = {
	CCI_ID: string;
	password: string;
};

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
	} = useForm<FormValues>({
		defaultValues: {
			CCI_ID: localStorage.getItem('CCI_ID') ?? '',
			password: '',
		},
		mode: 'onTouched',
	});
	useDocumentTitle('Login | Training Management');
	const [errorMsg, setErrorMsg] = useState('');
	const [loader, setLoader] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const redirectTo = location.search.replace('?redirect=', '');
	const refreshIntervalId = useSelector(selectRefreshIntervalId);

	const onSubmit = async (data: any) => {
		setLoader(true);
		if (errorMsg) setErrorMsg('');

		const loginResp = await authService.login({
			username: localStorage.getItem('CCI_ID') ?? '',
			password: data.password,
		});

		setLoader(false);

		if (loginResp.status === 400 && loginResp.data.message)
			setErrorMsg(loginResp.data.message);
		else {
			Helper.login(
				loginResp,
				navigate,
				dispatch,
				redirectTo,
				refreshIntervalId
			);
		}
	};

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const onForgotpassword = async () => {
		if (errorMsg) setErrorMsg('');

		const resetPasswordResp = await authService.resetPassword(
			localStorage.getItem('CCI_ID') ?? ''
		);
		if (resetPasswordResp.status === 400 && resetPasswordResp.data.message)
			setErrorMsg(resetPasswordResp.data.message);
		else {
			localStorage.setItem('resetPassword', 'true');
			await Helper.getConfirmAlert({ ...Helper.swalPropsEmailSent });
		}
	};

	return (
		<div className="w-6/12 m-auto mt-32 card border-solid border-2 p-5 bg-base-100 shadow-xl">
			<h1 className="font-bold text-3xl text-center">Login to your account</h1>
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className="m-auto w-6/12 mt-5"
			>
				<input
					type="text"
					placeholder="CCI ID"
					className={`input input-bordered w-full`}
					autoComplete="username"
					{...register('CCI_ID')}
					disabled={true}
				/>
				<DisplayErrorMsg message={errors.CCI_ID?.message?.toString()} />

				<div className="relative">
					<input
						type={isPasswordVisible ? 'text' : 'password'}
						placeholder="Password"
						className={`input input-bordered w-full ${errors.password ? 'input-error' : null
							}`}
						autoComplete="new-password"
						{...register('password', {
							required: {
								value: true,
								message: 'Password is required',
							},
						})}
					/>
					<ShowHidePasswordBtn
						isPasswordVisible={isPasswordVisible}
						togglePasswordVisibility={togglePasswordVisibility}
					/>
				</div>
				<DisplayErrorMsg message={errors.password?.message?.toString()} />

				<div className="text-right">
					<button
						type="button"
						className="link no-underline hover:underline text-violet-700"
						onClick={onForgotpassword}
					>
						Forgot password
					</button>
				</div>

				<div className="mt-5">
					<button
						type="submit"
						className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
						disabled={!isDirty || !isValid || loader}
					>
						Login
					</button>
				</div>

				<DisplayErrorMsg message={errorMsg} centerAlign={true} />
				<DevTool control={control} />
			</form>
		</div>
	);
};

export default Login;
