import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';

type FormValues = {
	CCI_ID: string;
};

interface FormProps {
	errorMsg: string;
	loader: boolean;
	onSubmit: (data: any) => void;
}

const Form = ({ errorMsg, loader, onSubmit }: FormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
	} = useForm<FormValues>({
		defaultValues: { CCI_ID: '' },
		mode: 'onTouched',
	});

	return (
		<form
			noValidate
			onSubmit={handleSubmit(onSubmit)}
			className="m-auto w-6/12 mt-5"
		>
			<input
				type="text"
				placeholder="CCI ID"
				className={`input input-bordered w-full ${
					errors.CCI_ID ? 'input-error' : null
				}`}
				{...register('CCI_ID', {
					required: { value: true, message: 'CCI ID is required' },
					minLength: { value: 8, message: 'Length should be 8 characters' },
					maxLength: { value: 8, message: 'Length should be 8 characters' },
				})}
			/>
			<DisplayErrorMsg message={errors.CCI_ID?.message?.toString()} />

			<div className="mt-5">
				<button
					className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
					type="submit"
					disabled={!isDirty || !isValid || loader}
				>
					Next
				</button>
			</div>

			<DisplayErrorMsg message={errorMsg} centerAlign={true} />
			<DevTool control={control} />
		</form>
	);
};

export default Form;
