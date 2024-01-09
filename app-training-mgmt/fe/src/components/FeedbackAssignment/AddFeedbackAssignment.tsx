import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { assignmentService } from '../../services/assignmnetService';
import { Helper } from '../../utils/helpers';
import StepsComponent from '../Common/StepComponet';
import { employeeService } from '../../services/employeeService';
import moment from 'moment';
import { NormalizedEmployeeInterface } from '../../interfaces/normalizedEmployeeInterface';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	resetUpdateData: () => void;
	updateData: any;
}

function AddFeedbackAssignment(item: PropOptions) {
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
	const [employees, setEmployees] = useState<NormalizedEmployeeInterface[]>([]);
	const [status, setStatus] = useState<string>('');
	const [assignmentOutline, setassignmentOutline] = useState<any[]>([]);
	const [selectedBatchAssignment, setSelectedBatchAssignment] =
		useState<any>(null);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const checkboxRef = useRef<HTMLInputElement>(null);
	const statusArray = ['Pending', 'Submitted'];

	useEffect(() => {
		getBatchAssignmentOutline();
		setIsUpdated(false);
	}, [isUpdated, selectedBatchAssignment]);

	useEffect(() => {
		if (item.updateData) {
			setInitialUpdateData();
		}
	}, [item.updateData]);

	useEffect(() => {
		getEmployees();
	}, [selectedBatchAssignment]);

	const getEmployees = async () => {
		if (selectedBatchAssignment) {
			const fetchedEmployees: any = await employeeService.getEmployeesForBatch(
				selectedBatchAssignment?.batchId?.id
			);
			setEmployees(fetchedEmployees);
		}
	};

	const getBatchAssignmentOutline = async () => {
		const fetchedData: any = await assignmentService.getBatchAssignmentOutline(
			0,
			'',
			''
		);
		const data = fetchedData.records.map((item: any) => {
			delete item.assignmentOutlineId.techTrainingId;
			return item;
		});
		setassignmentOutline(fetchedData.records);
	};

	const setInitialUpdateData = () => {
		const selectedRow = item.updateData;
		setValue('id', selectedRow.id);
		setValue(
			'batchAssignment',
			JSON.stringify(selectedRow.batchAssignmentOutlineId),
			{
				shouldValidate: true,
			}
		);
		setValue('employee', JSON.stringify(selectedRow.empId));
		setValue('status', selectedRow.status);
		setValue(
			'submissionDate',
			moment(new Date(selectedRow.submissionDate)).format('YYYY-MM-DD')
		);
		setValue('overallRating', selectedRow.overallRating);
		setValue('comment', selectedRow.comment);
		setValue('ratings', selectedRow.rating);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		data.batchAssignmentOutlineId = JSON.parse(data.batchAssignment);
		delete data.batchAssignment;
		data.empId = JSON.parse(data.employee);

		data.submissionDate = data.submissionDate || null;
		delete data.employee;

		let res;
		if (item.updateData) {
			res = await assignmentService.updateAssignmentFeedbackData(data);
		} else {
			res = await assignmentService.createAssignmentFeedback(data);
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
			const selectedBatchAssignment = getValues('batchAssignment');
			setSelectedBatchAssignment(JSON.parse(selectedBatchAssignment));
		}
		setStep(step + 1);
	};

	const clearForm = () => {
		reset();
		setStep(1);
		setSelectedBatchAssignment(null);
		item.resetUpdateData();
	};

	const handleInputChange = (e: any) => {
		setStatus(e.target.value);
	};

	const steps = [
		{ id: 1, title: 'Batch Assignment' },
		{ id: 2, title: 'Feedback' },
	];

	return (
		<>
			<input
				type="checkbox"
				id="addAssignmentFeedbackModal"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal ">
				<div className="modal-box p-4 max-w-2xl">
					<div>
						<h2 className="text-xl font-bold mb-4 text-center">
							Add Assignment Feedback
						</h2>
						<StepsComponent steps={steps} currentStep={step} />
						<form onSubmit={handleSubmit(onFormSubmit)}>
							{/* Step 1 */}
							{step === 1 && (
								<>
									<div className="pb-2">
										<div className="flex justify-between">
											<label
												htmlFor="batchAssignment"
												className="block text-sm font-medium text-black"
											>
												Batch Assignment Outline
											</label>
										</div>
										<select
											id="batchAssignment"
											className={`select input-bordered w-full mt-1 p-2 ${
												errors.batchAssignment ? 'input-error' : null
											}`}
											{...register('batchAssignment', {
												required: {
													value: true,
													message: 'Batch Assignment is required',
												},
											})}
										>
											<option value={''}>
												Select Batch Assignment Outline
											</option>
											{assignmentOutline.map((assignment) => (
												<option
													key={assignment.id}
													value={JSON.stringify(assignment)}
												>
													{assignment.batchId.batchTitle} :{' '}
													{assignment.assignmentOutlineId.topic}
												</option>
											))}
										</select>
										<DisplayErrorMsg
											message={errors.batchAssignment?.message?.toString()}
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
												htmlFor="batchAssignment"
												className="block text-sm font-medium text-black"
											>
												Batch Assignment Outline
											</label>
											<input
												id="batchAssignment"
												className="input input-bordered w-full mt-1 p-2"
												value={`${selectedBatchAssignment?.batchId.batchTitle}: ${selectedBatchAssignment.assignmentOutlineId.topic}`}
												disabled
												readOnly
											/>
										</div>
										<div className="pb-2 ml-1">
											<div className="flex justify-between">
												<label
													htmlFor="employee"
													className="block text-sm font-medium text-black pb-1"
												>
													Employee
												</label>
											</div>
											<select
												id="employee"
												className={`select input-bordered w-full p-2 ${
													errors.employee ? 'input-error' : null
												}`}
												{...register('employee', {
													required: {
														value: true,
														message: 'Employee is required',
													},
												})}
											>
												<option value={''}>Select Employee</option>
												{employees.map((employee) => (
													<option
														key={employee.id}
														value={JSON.stringify(employee)}
													>
														{employee.name}
													</option>
												))}
											</select>
											<DisplayErrorMsg
												message={errors.employee?.message?.toString()}
											/>
										</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<label
												htmlFor="status"
												className="block text-sm font-medium text-black"
											>
												Status
											</label>
											<select
												id="status"
												className={`select input-bordered w-full mt-1 p-2 ${
													errors.status ? 'input-error' : null
												}`}
												{...register('status', {
													required: {
														value: true,
														message: 'Status is required',
													},
												})}
												onChange={handleInputChange}
											>
												<option value={''}>Select Status</option>
												{statusArray.map((status: any) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
											<DisplayErrorMsg
												message={errors.status?.message?.toString()}
											/>
										</div>
										<div className="pb-2 ml-1">
											<label
												htmlFor="submissionDate"
												className="block text-sm font-medium text-black"
											>
												Submission Date
											</label>
											<input
												id="submissionDate"
												type="date"
												placeholder="MM-DD-YYYY"
												className={`input input-bordered w-full mt-1 p-2 ${
													errors.submissionDate ? 'input-error' : null
												}`}
												{...register('submissionDate', {
													required: {
														value: status === 'Submitted',
														message: 'Submission Date is required',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.submissionDate?.message?.toString()}
											/>
										</div>
									</div>
									<div className="flex">
										<div className="overflow-x-auto mb-2.5 w-full max-h-48">
											<table className="table">
												<thead className="text-black">
													<tr>
														<th className="text-sm font-medium text-black">
															Criteria
														</th>
														<th className="text-sm font-medium text-black">
															Rating (Max: 5)
														</th>
													</tr>
												</thead>
												<tbody className="">
													{Object.values(
														selectedBatchAssignment.assignmentOutlineId
															.ratingKeys
													).map((rating: any, index) => (
														<tr key={index}>
															<td className="py-2">
																<div className="flex items-center gap-3 text-base">
																	{rating}
																</div>
															</td>
															<td className="py-2">
																<input
																	id={`ratings.${rating}`}
																	type="number"
																	className={`input input-bordered h-8 p-2 ${
																		errors.ratings ? 'input-error' : null
																	}`}
																	{...register(`ratings.${rating}`, {
																		max: {
																			value: 5,
																			message: 'Max value allowed is 5',
																		},
																		required: {
																			value: true,
																			message: 'Rating is required',
																		},
																	})}
																/>
																<DisplayErrorMsg
																	message={errors[
																		`ratings.${rating}`
																	]?.message?.toString()}
																/>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<div className="flex justify-between">
												<label
													htmlFor="overallRating"
													className="block text-sm font-medium text-black pb-1"
												>
													Overall Rating Comment
												</label>
											</div>
											<textarea
												id="overallRating"
												rows={2}
												className={`textarea input-bordered w-full ${
													errors.overallRating ? 'input-error' : null
												}`}
												{...register('overallRating', {
													required: {
														value: true,
														message: 'Overall Rating is required',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.overallRating?.message?.toString()}
											/>
										</div>
										<div className="pb-2 ml-1">
											<div className="flex justify-between">
												<label
													htmlFor="comment"
													className="block text-sm font-medium text-black pb-1"
												>
													Misc. Comment
												</label>
											</div>
											<textarea
												id="comment"
												rows={2}
												className={`textarea input-bordered w-full ${
													errors.comment ? 'input-error' : null
												}`}
												{...register('comment', {
													required: {
														value: true,
														message: 'Comment is required',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.comment?.message?.toString()}
											/>
										</div>
									</div>
								</>
							)}

							<div className="flex justify-end space-x-2 mt-4">
								<label
									htmlFor="addAssignmentFeedbackModal"
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
										type="submit"
										disabled={!isDirty || !isValid}
									>
										Save
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

export default AddFeedbackAssignment;
