import React, { useEffect, useRef, useState } from 'react';
import { employeeService } from '../../services/employeeService';
import { batchService } from '../../services/batchService';
import { NormalizedBatchInterface } from '../../interfaces/normalizeBatchInterface';
import { BATCH_STATUS } from '../../constants/constants';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import TypeAheadDropDown from '../Common/TypeAheadDropdown';
import { Helper } from '../../utils/helpers';
import { assignmentService } from '../../services/assignmnetService';
import { Tech } from '../../interfaces/assignmnetInterface';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
}

function AddBatch(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
		setValue,
	} = useForm<NormalizedBatchInterface>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [employees, setEmployees] = useState<any>([]);
	const [parentBatch, setParentBatch] = useState<any[]>([]);
	const [tech, setTech] = useState<Tech[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		getData();
		setRefresh(false);
	}, [refresh]);

	const getData = async () => {
		const fetchBatches = await batchService.getParentBatches(true);
		setParentBatch(fetchBatches);

		const fetchEmployee = await employeeService.getActiveEmployees();
		setEmployees(fetchEmployee);

		const fetchedTech: any = await assignmentService.getAllTech(
			0,
			'name',
			'',
			'asc'
		);
		setTech(fetchedTech.records);
	};

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		if (name === 'parent') {
			const selectedBatch = JSON.parse(value);

			setValue('techTopic', selectedBatch.techTopic);
			setValue(
				'trainingCoordinator',
				getFullName(selectedBatch.trainingCoordinator)
			);
			setValue('headTrainer', getFullName(selectedBatch.headTrainer));
		}
	};

	const getFullName = (name: string) => {
		if (name) {
			const employee = employees.find((emp: any) =>
				emp.name.toLowerCase().includes(name.toLowerCase())
			);
			return employee ? employee.name : '';
		}
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');

		if (data.parent?.id == '' || !data.parent) {
			delete data.parent;
		} else {
			data.parent = JSON.parse(data.parent);
		}

		if (data.techId?.id === '' || !data.techId) {
			delete data.techId;
		} else {
			data.techId = JSON.parse(data.techId);
		}
		if (data.endDate === '') data.endDate = null;
		if (data.noOfTrainees === '') data.noOfTrainees = null;

		const res: any = await batchService.CreateBatch(data);

		if (res.status === 201) {
			//Display toast message
			Helper.showSavedAlert();
			//Reset the form
			item.getIsUpdated(true);
			setRefresh(true);

			clearForm();
			if (checkboxRef.current) {
				checkboxRef.current.checked = false;
			}
		} else {
			Helper.showErrorAlert();
		}
	};

	const clearForm = () => {
		reset();
	};

	const setTechValue = (value: string) => {
		setValue('techTopic', value);
	};

	return (
		parentBatch &&
		employees && (
			<>
				<input
					type="checkbox"
					id="my_modal_7"
					className="modal-toggle"
					ref={checkboxRef}
				/>
				<div className="modal">
					<div className="modal-box p-4  w-10/12">
						<h2 className="text-xl font-bold mb-4">Add New Batch</h2>

						{/* Add a form with input fields */}
						<form onSubmit={handleSubmit(onFormSubmit)}>
							<div className="py-1">
								<label
									htmlFor="batchTitle"
									className="block text-sm font-medium text-black"
								>
									Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="batchTitle"
									className={`input mt-1 input-bordered w-full ${
										errors.batchTitle ? 'input-error' : null
									}`}
									{...register('batchTitle', {
										required: {
											value: true,
											message: 'Batch Title is required',
										},
									})}
								/>
								<DisplayErrorMsg
									message={errors.batchTitle?.message?.toString()}
								/>
							</div>
							<div className="py-1">
								<label
									htmlFor="description"
									className="block text-sm font-medium text-black"
								>
									Description
								</label>
								<input
									type="text"
									id="description"
									className={`input mt-1 input-bordered w-full `}
									{...register('description')}
								/>
								<DisplayErrorMsg
									message={errors.description?.message?.toString()}
								/>
							</div>
							<div className="py-1">
								<label
									htmlFor="parent"
									className="block text-sm font-medium text-black"
								>
									Parent Batch
								</label>

								<select
									id="parent"
									className="select mt-1 p-2 w-full border border-gray-300"
									{...register('parent')}
									onChange={handleInputChange}
								>
									<option value={''}>Select a parent batch</option>
									{parentBatch.map((batch) => (
										<option key={batch.id} value={JSON.stringify(batch)}>
											{batch.batchTitle} : {batch.techTopic}
										</option>
									))}
								</select>
							</div>
							<div className="py-1 mt-2">
								<label
									htmlFor="techTopic"
									className="block text-sm font-medium text-black"
								>
									Tech Topic <span className="text-red-500">*</span>
								</label>
								<TypeAheadDropDown
									items={parentBatch.map((item) => item.techTopic)}
									register={register('techTopic', {
										required: {
											value: true,
											message: 'Tech Topic is required',
										},
									})}
									setValue={setTechValue}
									error={errors.techTopic}
								/>
								<DisplayErrorMsg
									message={errors.techTopic?.message?.toString()}
								/>
							</div>

							<div className="grid grid-cols-2">
								<div className="py-1 mr-2">
									<label
										htmlFor="startDate"
										className="block text-sm font-medium text-black"
									>
										Start Date <span className="text-red-500">*</span>
									</label>
									<input
										type="date"
										id="startDate"
										className={`input input-bordered w-full ${
											errors.startDate ? 'input-error' : null
										}`}
										{...register('startDate', {
											required: {
												value: true,
												message: 'Start Date is required',
											},
										})}
									/>
									<DisplayErrorMsg
										message={errors.startDate?.message?.toString()}
									/>
								</div>
								<div className="py-1 ml-2">
									<label
										htmlFor="endDate"
										className="block text-sm font-medium text-black"
									>
										End Date
									</label>
									<input
										type="date"
										id="endDate"
										className="input w-full border border-gray-300"
										{...register('endDate')}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 py-1">
								<div className=" mr-2">
									<label
										htmlFor="trainingCoordinator"
										className="block text-sm font-medium text-black"
									>
										Training Coordinator <span className="text-red-500">*</span>
									</label>

									<select
										id="trainingCoordinator"
										className={`select mt-1 p-2 w-full input-bordered ${
											errors.trainingCoordinator ? 'input-error' : null
										}`}
										{...register('trainingCoordinator', {
											required: {
												value: true,
												message: 'Training Coordinator is required',
											},
										})}
									>
										<option value={''}>Select Training Coordinator</option>
										{employees.map((emp: any) => (
											<option key={emp.id} value={emp.name}>
												{emp.name}
											</option>
										))}
									</select>
									<DisplayErrorMsg
										message={errors.trainingCoordinator?.message?.toString()}
									/>
								</div>
								<div className="ml-2">
									<label
										htmlFor="headTrainer"
										className="block text-sm font-medium text-black"
									>
										Head Trainer <span className="text-red-500">*</span>
									</label>
									<select
										id="headTrainer"
										className={`select mt-1 p-2 w-full input-bordered ${
											errors.headTrainer ? 'input-error' : null
										}`}
										{...register('headTrainer', {
											required: {
												value: true,
												message: 'Head Trainer is required',
											},
										})}
									>
										<option value={''}>Select Head Trainer</option>
										{employees.map((emp: any) => (
											<option key={emp.id} value={emp.name}>
												{emp.name}
											</option>
										))}
										<option value={'Self Learning '}>Self Learning</option>
									</select>
									<DisplayErrorMsg
										message={errors.headTrainer?.message?.toString()}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2">
								<div className="py-1 mr-2">
									<label
										htmlFor="status"
										className="block text-sm font-medium text-black"
									>
										Status <span className="text-red-500">*</span>
									</label>
									<select
										id="status"
										className={`select mt-1 p-2 w-full input-bordered ${
											errors.status ? 'input-error' : null
										}`}
										{...register('status', {
											required: {
												value: true,
												message: 'Status is required',
											},
										})}
									>
										<option value={''}>Select status</option>
										{BATCH_STATUS.map((status: any, index) => (
											<option key={index} value={status}>
												{status}
											</option>
										))}
									</select>
									<DisplayErrorMsg
										message={errors.status?.message?.toString()}
									/>
								</div>
								<div className="py-1 ml-2">
									<label
										htmlFor="noOfTrainees"
										className="block text-sm font-medium text-black"
									>
										No. of trainees
									</label>
									<input
										type="number"
										id="noOfTrainees"
										className={`input mt-1 input-bordered w-full `}
										{...register('noOfTrainees', {
											min: {
												value: 1,
												message: 'Number must be greater than 0 or empty',
											},
										})}
									/>
									<DisplayErrorMsg
										message={errors.noOfTrainees?.message?.toString()}
									/>
								</div>
							</div>
							<div className="py-1 mr-2">
								<label
									htmlFor="techId"
									className="block text-sm font-medium text-black"
								>
									Tech
								</label>
								<select
									id="techId"
									className={`select mt-1 p-2 w-full input-bordered`}
									{...register('techId')}
								>
									<option value={''}>Select Tech</option>
									{tech.map((tech) => (
										<option key={tech.id} value={JSON.stringify(tech)}>
											{tech.name}
										</option>
									))}
								</select>
								<DisplayErrorMsg message={errors.techId?.message?.toString()} />
							</div>

							{/* Add 'Save' and 'Close' buttons */}
							<div className="flex justify-end space-x-2 mt-2">
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
					></label>
				</div>
			</>
		)
	);
}

export default AddBatch;
