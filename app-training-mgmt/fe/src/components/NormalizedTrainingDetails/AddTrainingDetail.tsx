import React, { useEffect, useRef, useState } from 'react';
import { employeeService } from '../../services/employeeService';
import { batchService } from '../../services/batchService';
import { NormalizedEmployeeInterface } from '../../interfaces/normalizedEmployeeInterface';
import { trainingDashboardService } from '../../services/trainingDashboardService';
import { useForm } from 'react-hook-form';
import { CreateTrainingDetailInterface } from '../../interfaces/normalizedTrainingDetailInterface';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { NormalizedBatchInterface } from '../../interfaces/normalizeBatchInterface';
import { Helper } from '../../utils/helpers';
interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
}

const InitialFormValue = {
	empId: '',
	batchId: '',
};
function AddTrainingDetails(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
		setValue,
	} = useForm<CreateTrainingDetailInterface>({
		defaultValues: InitialFormValue,
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');

	const [employees, setEmployees] = useState<NormalizedEmployeeInterface[]>();
	const [batches, setBatches] = useState<NormalizedBatchInterface[]>();
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const fetchedEmployees = await employeeService.getActiveEmployees();
		setEmployees(fetchedEmployees);

		const res = await batchService.getAllBatchesDataForSort(
			'normalize',
			0,
			'',
			'',
			'',
			''
		);
		const fetchedBatches: any = res.records;
		setBatches(fetchedBatches);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		const res = await trainingDashboardService.createTrainingDetail(data);

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

	if (!employees || !batches) {
		return <div>Loading...</div>;
	}

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
					<h3 className="text-xl font-bold mb-4">Add Training Detail</h3>

					{/* Add a form with input fields */}
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="py-2">
							<label htmlFor="empId" className="block font-medium text-black">
								Employee <span className="text-red-500">*</span>
							</label>
							<select
								id="empId"
								className={`select input-bordered w-full text-black ${
									errors.empId ? 'input-error' : null
								}`}
								{...register('empId', {
									required: { value: true, message: 'Employee is required' },
								})}
							>
								<option value={''}>Select employee</option>
								{employees.map((emp) => (
									<option key={emp.id} value={emp.id}>
										{emp.name} - {emp.id} - {emp.currDesignation}
									</option>
								))}
							</select>
							<DisplayErrorMsg message={errors.empId?.message?.toString()} />
						</div>
						<div className="py-2">
							<label htmlFor="batchId" className="block font-medium text-black">
								Batch <span className="text-red-500">*</span>
							</label>
							<select
								id="batchId"
								className={`select input-bordered w-full text-black ${
									errors.batchId ? 'input-error' : null
								}`}
								{...register('batchId', {
									required: { value: true, message: 'Batch is required' },
								})}
							>
								<option value={''}>Select Batch</option>
								{batches.map((batch) => (
									<option key={batch.id} value={batch.id}>
										{batch.batchTitle} : {batch.techTopic}
									</option>
								))}
							</select>
							<DisplayErrorMsg message={errors.batchId?.message?.toString()} />
						</div>

						{/* Add 'Save' and 'Close' buttons */}
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
				<label
					className="modal-backdrop"
					htmlFor="my_modal_7"
					onClick={clearForm}
				>
					Close
				</label>
			</div>
		</>
	);
}

export default AddTrainingDetails;
