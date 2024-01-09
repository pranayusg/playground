import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { authService } from '../../services/authService';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import ShowHidePasswordBtn from '../Common/ShowHidePassword';
import { useNavigate } from 'react-router-dom';
import { Helper } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectRefreshIntervalId } from '../../store/features/globalSlice';

type FormValues = {
	CCI_ID: string;
	password: string;
	confirm_password: string;
};

interface SignUpProps {
	setPasswordToken: string;
}

const SignUp = (props: SignUpProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		watch,
	} = useForm<FormValues>({
		defaultValues: {
			CCI_ID: localStorage.getItem('CCI_ID') ?? '',
			password: '',
			confirm_password: '',
		},
		mode: 'onTouched',
	});

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [loader, setLoader] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const password = watch('password');
	const refreshIntervalId = useSelector(selectRefreshIntervalId);

	const onSubmit = async (data: any) => {
		setLoader(true);
		if (errorMsg) setErrorMsg('');

		const setPasswordRes = await authService.setPassword(
			props.setPasswordToken,
			{
				password: data.password,
			}
		);

		if (
			setPasswordRes.status >= 400 &&
			setPasswordRes.status < 500 &&
			setPasswordRes.data.message
		)
			setErrorMsg(setPasswordRes.data.message);
		else {
			const loginResp = await authService.login({
				username: localStorage.getItem('CCI_ID') ?? '',
				password: data.password,
			});

			if (loginResp.status === 400 && loginResp.data.message)
				setErrorMsg(loginResp.data.message);
			else {
				if (localStorage.getItem('resetPassword'))
					localStorage.removeItem('resetPassword');
				Helper.login(loginResp, navigate, dispatch, '', refreshIntervalId);
			}
		}
		setLoader(false);
	};

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const toggleConfirmPasswordVisibility = () => {
		setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
	};

	return (
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
					className={`input input-bordered w-full ${
						errors.password ? 'input-error' : null
					}`}
					autoComplete="new-password"
					{...register('password', {
						required: { value: true, message: 'Password is required' },
						minLength: {
							value: 8,
							message: 'Should be more than 8 characters',
						},
						maxLength: {
							value: 20,
							message: 'Should be less than 20 characters',
						},
						validate: {
							shouldContainLowerCaseCharcter: (fieldValue) => {
								return (
									fieldValue.match(/^(?=.*[a-z])/) !== null ||
									'Should contain at least one lowercase letter'
								);
							},
							shouldContainUpperCaseCharcter: (fieldValue) => {
								return (
									fieldValue.match(/^(?=.*[A-Z])/) !== null ||
									'Should contain at least one uppercase letter'
								);
							},
							shouldContainDigit: (fieldValue) => {
								return (
									fieldValue.match(/^(?=.*\d)/) !== null ||
									'Should contain at least one digit'
								);
							},
							shouldContainSpecialCharcter: (fieldValue) => {
								return (
									fieldValue.match(/^(?=.*[!@#$%^&*])/) !== null ||
									'Should contain at least one special character (!@#$%^&*)'
								);
							},
						},
					})}
				/>
				<ShowHidePasswordBtn
					isPasswordVisible={isPasswordVisible}
					togglePasswordVisibility={togglePasswordVisibility}
				/>
			</div>
			<DisplayErrorMsg message={errors.password?.message?.toString()} />

			<div className="relative">
				<input
					type={isConfirmPasswordVisible ? 'text' : 'password'}
					placeholder="Confirm Password"
					className={`input input-bordered w-full ${
						errors.confirm_password ? 'input-error' : null
					}`}
					autoComplete="new-password"
					{...register('confirm_password', {
						required: {
							value: true,
							message: 'Confirm Password is required',
						},
						validate: {
							shouldMatchPassword: (fieldValue) => {
								return (
									fieldValue === password ||
									'Confirm password should match password'
								);
							},
						},
					})}
				/>
				<ShowHidePasswordBtn
					isPasswordVisible={isConfirmPasswordVisible}
					togglePasswordVisibility={toggleConfirmPasswordVisibility}
				/>
			</div>
			<DisplayErrorMsg message={errors.confirm_password?.message?.toString()} />

			<div className="mt-5">
				<button
					className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
					type="submit"
					disabled={!isDirty || !isValid || loader}
				>
					{localStorage.getItem('resetPassword') ? 'Reset' : 'Create account'}
				</button>
			</div>

			<DisplayErrorMsg message={errorMsg} centerAlign={true} />
			<DevTool control={control} />
		</form>
	);
};

export default SignUp;
