import React, { useRef, useState } from 'react';
import { certificationService } from '../../services/certificationService';
import { useForm } from 'react-hook-form';
import { NormalizedApprovedCertificationInterface } from '../../interfaces/normalizedCertificationInterface';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Helper } from '../../utils/helpers';
interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
}

const InitialFormValue = {
	tech: '',
	certificationName: '',
	level: '',
	costInDollars: null,
};

function AddApprovedCertification(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		control,
	} = useForm<NormalizedApprovedCertificationInterface>({
		defaultValues: InitialFormValue,
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const checkboxRef = useRef<HTMLInputElement>(null);

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');

		if (!data.costInDollars) {
			delete data.costInDollars;
		}

		const res: any = await certificationService.createCertification(
			'normalizeApproved',
			data
		);

		if (res.status === 201) {
			//Display toast message
			Helper.showSavedAlert();
			item.getIsUpdated(true);
			//Reset the form
			clearForm();
			if (checkboxRef.current) {
				checkboxRef.current.checked = false;
			}
		} else {
			Helper.showErrorAlert();
		}
	};

	const clearForm = () => {
		reset(InitialFormValue);
	};
	return (
		<>
			<input
				type="checkbox"
				id="my_modal_7"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal">
				<div className="modal-box p-4">
					<h3 className="text-xl font-bold mb-4">
						Add New Approved certification
					</h3>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="py-2">
							<label
								htmlFor="certificationName"
								className="block text-sm font-medium text-black"
							>
								Certification Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="certificationName"
								className={`input input-bordered w-full ${
									errors.certificationName ? 'input-error' : null
								}`}
								{...register('certificationName', {
									required: {
										value: true,
										message: 'Certification Name is required',
									},
								})}
							/>
							<DisplayErrorMsg
								message={errors.certificationName?.message?.toString()}
							/>
						</div>
						<div className="py-2">
							<label
								htmlFor="tech"
								className="block text-sm font-medium text-black"
							>
								Tech <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="tech"
								className={`input input-bordered w-full ${
									errors.tech ? 'input-error' : null
								}`}
								{...register('tech', {
									required: {
										value: true,
										message: 'Tech is required',
									},
								})}
							/>
							<DisplayErrorMsg message={errors.tech?.message?.toString()} />
						</div>
						<div className="py-2">
							<label
								htmlFor="level"
								className="block text-sm font-medium text-black"
							>
								Level <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="level"
								className={`input input-bordered w-full ${
									errors.level ? 'input-error' : null
								}`}
								{...register('level', {
									required: {
										value: true,
										message: 'Level is required',
									},
								})}
							/>
							<DisplayErrorMsg message={errors.level?.message?.toString()} />
						</div>
						<div className="py-2">
							<label
								htmlFor="costInDollars"
								className="block text-sm font-medium text-black"
							>
								Cost In Dollars
							</label>
							<input
								type="text"
								id="costInDollars"
								className={`input input-bordered w-full `}
								{...register('costInDollars')}
							/>
						</div>
						<div className="flex justify-end space-x-2 mt-4">
							<label
								htmlFor="my_modal_7"
								className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
								onClick={clearForm}
							>
								X
							</label>
							<button
								className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
								type="submit"
								disabled={!isDirty || !isValid}
							>
								Save
							</button>
						</div>
					</form>
				</div>
				<label className="modal-backdrop" htmlFor="my_modal_7"></label>
			</div>
		</>
	);
}

export default AddApprovedCertification;
