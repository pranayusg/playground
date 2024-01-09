import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { AssignmentOutline } from '../../interfaces/assignmnetInterface';
import { assignmentService } from '../../services/assignmnetService';
import { Helper } from '../../utils/helpers';
import StepsComponent from '../Common/StepComponet';
import { batchService } from '../../services/batchService';
import moment from 'moment';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	resetUpdateData: () => void;
	updateData: any;
	isTrainer: boolean;
}

function AddBatchAssignment(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		getValues,
		setValue,
	} = useForm<any>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [step, setStep] = useState<number>(1);
	const [batch, setBatch] = useState<any[]>([]);
	const [assignmentOutline, setassignmentOutline] = useState<
		AssignmentOutline[]
	>([]);
	const [selectedBatch, setSelectedBatch] = useState<any>(null);
	const [selectedAssignment, setSelectedAssignment] =
		useState<AssignmentOutline | null>(null);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		getBatches();
		getAssignmentOutline();
		setIsUpdated(false);
	}, [isUpdated]);

	useEffect(() => {
		if (item.updateData) {
			setInitialUpdateData();
		}
	}, [item.updateData]);

	const getBatches = async () => {
		const fetchedBatches = await batchService.getParentBatches(
			item.isTrainer ? true : false
		);
		setBatch(fetchedBatches);
	};

	const getAssignmentOutline = async () => {
		const fetchedData: any = await assignmentService.getAssignmentOutline(
			0,
			'',
			'',
			''
		);
		const data = fetchedData.records.map((item: any) => {
			delete item.techTrainingId.techId;
			return item;
		});
		setassignmentOutline(data);
	};

	const setInitialUpdateData = () => {
		const selectedRow = item.updateData;
		setValue('id', selectedRow.id);
		setValue('batch', JSON.stringify(selectedRow.batchId), {
			shouldValidate: true,
		});
		setValue(
			'assignmentOutline',
			JSON.stringify(selectedRow.assignmentOutlineId)
		);
		setValue(
			'startDate',
			moment(new Date(selectedRow.startDate)).format('YYYY-MM-DD')
		);
		setValue(
			'endDate',
			moment(new Date(selectedRow.endDate)).format('YYYY-MM-DD')
		);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		data.batchId = JSON.parse(data.batch);
		delete data.batch;
		data.assignmentOutlineId = JSON.parse(data.assignmentOutline);
		delete data.assignmentOutline;

		let res;
		if (item.updateData) {
			res = await assignmentService.updateBatchAssignmentData(data);
		} else {
			res = await assignmentService.createBatchAssignmentOutline(data);
		}

		if (res.status === 201 || (item.updateData && res.status === 200)) {
			Helper.showSavedAlert(
				item.updateData ? 'Record updated successfully' : ''
			);
			item.getIsUpdated(true);
			clearForm();
			if (checkboxRef.current) {
				checkboxRef.current.checked = false;
			}
		} else {
			Helper.showErrorAlert();
		}
	};

	const handleNext = () => {
		if (step === 1) {
			const selectedBatch = getValues('batch');
			setSelectedBatch(JSON.parse(selectedBatch));
		}
		setStep(step + 1);
		if (step === 2) {
			const selectedAssignment = getValues('assignmentOutline');
			setSelectedAssignment(JSON.parse(selectedAssignment));
		}
		setStep(step + 1);
	};

	const clearForm = () => {
		reset();
		setStep(1);
		setSelectedBatch(null);
		setSelectedAssignment(null);
		item.resetUpdateData();
	};

	const steps = [
		{ id: 1, title: 'Batch' },
		{ id: 2, title: 'Assignment' },
		{ id: 3, title: 'Batch Assignment' },
	];

	return (
		<>
			<input
				type="checkbox"
				id="addBatchAssignmentModal"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal ">
				<div className="modal-box p-4 max-w-2xl">
					<div>
						<h2 className="text-xl font-bold mb-4 text-center">
							{`${item.updateData ? 'Update' : 'Add'} Batch Assignment`}
						</h2>
						<StepsComponent steps={steps} currentStep={step} />
						<form onSubmit={handleSubmit(onFormSubmit)}>
							{/* Step 1 */}
							{step === 1 && (
								<>
									<div className="pb-2">
										<div className="flex justify-between">
											<label
												htmlFor="batch"
												className="block text-sm font-medium text-black"
											>
												Batch
											</label>
										</div>
										<select
											id="batch"
											className={`select input-bordered w-full mt-1 p-2 ${
												errors.batch ? 'input-error' : null
											}`}
											{...register('batch', {
												required: { value: true, message: 'Batch is required' },
											})}
										>
											<option value={''}>Select Batch</option>
											{batch.map((batch) => (
												<option key={batch.id} value={JSON.stringify(batch)}>
													{batch.batchTitle} : {batch.techTopic}
												</option>
											))}
										</select>
										<DisplayErrorMsg
											message={errors.batch?.message?.toString()}
										/>
									</div>
								</>
							)}

							{/* Step 2 */}
							{step === 2 && (
								<>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<label
												htmlFor="batch"
												className="block text-sm font-medium text-black"
											>
												Batch
											</label>
											<input
												id="batch"
												className="input input-bordered w-full mt-1 p-2"
												value={
													selectedBatch?.batchTitle +
													':' +
													selectedBatch.techTopic
												}
												disabled
												readOnly
											/>
										</div>
										<div className="pb-2 ml-1">
											<div className="flex justify-between">
												<label
													htmlFor="assignmentOutline"
													className="block text-sm font-medium text-black pb-1"
												>
													Assignment Outline
												</label>
											</div>
											<select
												id="assignmentOutline"
												className={`select input-bordered w-full p-2 ${
													errors.assignmentOutline ? 'input-error' : null
												}`}
												{...register('assignmentOutline', {
													required: {
														value: true,
														message: 'Assignment is required',
													},
												})}
											>
												<option value={''}>Select Assignment Outline</option>
												{assignmentOutline.map((assignmentOutline) => (
													<option
														key={assignmentOutline.id}
														value={JSON.stringify(assignmentOutline)}
													>
														{assignmentOutline.topic}
													</option>
												))}
											</select>
											<DisplayErrorMsg
												message={errors.assignmentOutline?.message?.toString()}
											/>
										</div>
									</div>
								</>
							)}

							{/* Step 3 */}
							{step === 3 && (
								<>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<label
												htmlFor="batch"
												className="block text-sm font-medium text-black"
											>
												Batch
											</label>
											<input
												id="batch"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedBatch?.batchTitle}
												disabled
												readOnly
											/>
										</div>
										<div className="pb-2 ml-1">
											<label
												htmlFor="assignmentTopic"
												className="block text-sm font-medium text-black"
											>
												Assignment Topic
											</label>
											<input
												id="assignmentTopic"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedAssignment?.topic}
												disabled
												readOnly
											/>
										</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="mr-1 pb-1">
											<label
												htmlFor="duration"
												className="block text-sm font-medium text-black"
											>
												Assignment duration
											</label>
											<input
												id="duration"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedAssignment?.duration}
												disabled
												readOnly
											/>
										</div>
										<div className="ml-1 pb-1">
											<label
												htmlFor="link"
												className="block text-sm font-medium text-black"
											>
												Assignment link
											</label>
											<input
												id="link"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedAssignment?.link}
												disabled
												readOnly
											/>
										</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="mr-1 pb-1">
											<label
												htmlFor="startDate"
												className="block text-sm font-medium text-black"
											>
												Start Date
												<span className="text-red-500"> *</span>
											</label>
											<input
												id="startDate"
												type="date"
												placeholder="MM-DD-YYYY"
												className={`input input-bordered w-full mt-1 p-2 ${
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
										<div className="ml-1 pb-1">
											<label
												htmlFor="endDate"
												className="block text-sm font-medium text-black"
											>
												End Date
												<span className="text-red-500"> *</span>
											</label>
											<input
												id="endDate"
												type="date"
												placeholder="MM-DD-YYYY"
												className={`input input-bordered w-full mt-1 p-2 ${
													errors.endDate ? 'input-error' : null
												}`}
												{...register('endDate', {
													required: {
														value: true,
														message: 'End Date is required',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.endDate?.message?.toString()}
											/>
										</div>
									</div>
								</>
							)}

							<div className="flex justify-end space-x-2 mt-4">
								<label
									htmlFor="addBatchAssignmentModal"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
									onClick={clearForm}
								>
									X
								</label>
								{step === 1 && (
									<button
										className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
										type="button"
										onClick={handleNext}
										disabled={!isValid}
									>
										Next
									</button>
								)}
								{step === 2 && (
									<button
										className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
										type="button"
										onClick={handleNext}
										disabled={!isValid}
									>
										Next
									</button>
								)}
								{step === 3 && (
									<button
										className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
										type="submit"
										disabled={!isDirty || !isValid}
									>
										{`${item.updateData ? 'Update' : 'Save'}`}
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddBatchAssignment;
