import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Tech, TechTraining } from '../../interfaces/assignmnetInterface';
import { assignmentService } from '../../services/assignmnetService';
import AddTech from './AddTech';
import { Helper } from '../../utils/helpers';
import AddTechTraining from './AddTechTrining';
import StepsComponent from '../Common/StepComponet';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	resetUpdateData: () => void;
	updateData: any;
}

function AddAssignment(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
		getValues,
		setValue,
		setError,
	} = useForm<any>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [step, setStep] = useState<number>(1);
	const [tech, setTech] = useState<Tech[]>([]);
	const [techTraining, setTechTraining] = useState<TechTraining[]>([]);
	const [selectedTech, setSelectedTech] = useState<Tech | null>(null);
	const [selectedTechTraining, setSelectedTechTraining] =
		useState<TechTraining | null>(null);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const [addTech, setAddTech] = useState<boolean>(false);
	const [addTechTraining, setAddTechTraining] = useState<boolean>(false);
	const [criteria, setCriteria] = useState<any>([]);
	const [addNewCriteria, setAddNewCriteria] = useState<boolean>(false);
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		getData();
		getTechTraining();
		getEvaluationCriteria();
		setIsUpdated(false);
	}, [isUpdated]);

	useEffect(() => {
		getTechTraining();
		setIsUpdated(false);
	}, [selectedTech, isUpdated]);

	useEffect(() => {
		if (item.updateData) {
			setInitialUpdateData();
		}
	}, [item.updateData]);

	const getData = async () => {
		const fetchedTech: any = await assignmentService.getAllTech(0, '', '', '');
		setTech(fetchedTech.records);
	};

	const getTechTraining = async () => {
		const fetchedTechTraining: any = await assignmentService.getAllTechTraining(
			0,
			'',
			selectedTech?.name ? selectedTech.name : '',
			'',
			''
		);
		setTechTraining(fetchedTechTraining.records);
	};

	const getEvaluationCriteria = async () => {
		const fetchedCriteria: any =
			await assignmentService.getEvaluationCriteria();
		setCriteria(fetchedCriteria.records);
	};

	const setInitialUpdateData = () => {
		const selectedRow = item.updateData;
		setValue('id', selectedRow.id);
		setValue('tech', JSON.stringify(selectedRow.techTrainingId.techId), {
			shouldValidate: true,
		});
		setValue('techTrainingId', JSON.stringify(selectedRow.techTrainingId));
		setValue('link', selectedRow.link);
		setValue('duration', selectedRow.duration);
		setValue('assignmentTopic', selectedRow.topic);
		if (selectedRow.ratingKeys) {
			let filteredCriteria = criteria.filter((item: any) =>
				selectedRow.ratings.includes(item.name)
			);

			const userAddedCriteria =
				selectedRow.ratings !== '' &&
				selectedRow.ratings
					.split(', ')
					.filter(
						(item: any) =>
							!criteria.map((item: any) => item.name).includes(item)
					);
			if (userAddedCriteria.length) {
				userAddedCriteria.forEach((item: any) => {
					criteria.push({ name: item });
					filteredCriteria.push({ name: item });
				});
				setCriteria(criteria);
			}
			const stringifiedCriteria = filteredCriteria.map((item: any) =>
				JSON.stringify(item)
			);
			setValue('criteria', stringifiedCriteria);
		}
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		delete data.tech;
		data.techTrainingId = JSON.parse(data.techTrainingId);
		delete data.techTrainingId.techId;
		data.topic = data.assignmentTopic;
		delete data.assignmentTopic;
		const ratings = data.criteria;
		data.ratingKeys = {};
		ratings.forEach((element: any, index: number) => {
			const rating = JSON.parse(element);
			data.ratingKeys[index] = rating.name;
		});
		delete data.criteria;
		data.duration = parseInt(data.duration);

		let res;
		if (item.updateData) {
			res = await assignmentService.updateAssignmentData(data);
		} else {
			res = await assignmentService.createAssignmentOutline(data);
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
			const selectedTech = getValues('tech');
			setSelectedTech(JSON.parse(selectedTech));
		}
		setStep(step + 1);
		if (step === 2) {
			const selectedTechTraining = getValues('techTrainingId');
			setSelectedTechTraining(JSON.parse(selectedTechTraining));
		}
		setStep(step + 1);
	};

	const clearForm = () => {
		reset();
		setStep(1);
		setSelectedTech(null);
		setSelectedTechTraining(null);
		setAddTech(false);
		setAddTechTraining(false);
		item.resetUpdateData();
	};

	const handleupdated = (isUpdated: boolean) => {
		setIsUpdated(isUpdated);
		setAddTech(false);
		setAddTechTraining(false);
	};

	const handleCanceled = (isCancelled: boolean, form: string) => {
		if (form === 'tech' && isCancelled) {
			setAddTech(false);
		} else if (form === 'techTraining' && isCancelled) {
			setAddTechTraining(false);
		}
	};

	const insertNewCriteria = (e: any) => {
		const newCriteria = getValues('newCriteria');
		if (
			criteria.find(
				(item: any) => item.name.toLowerCase() === newCriteria.toLowerCase()
			) ||
			!newCriteria
		) {
			setError('newCriteria', {
				type: 'custom',
				message: !newCriteria
					? 'Please enter criteria'
					: 'Criteria already exists',
			});
		} else {
			criteria.push({ name: newCriteria, checked: true });
			setCriteria(criteria);
			setValue('newCriteria', '');
			setAddNewCriteria(false);
		}
	};

	const cancelNewCriteria = () => {
		setValue('newCriteria', '');
		setAddNewCriteria(false);
		// setError('newCriteria', null);
	};

	const steps = [
		{ id: 1, title: 'Tech' },
		{ id: 2, title: 'Tech Training' },
		{ id: 3, title: 'Assignment' },
	];

	return (
		<>
			<input
				type="checkbox"
				id="addAssignmentModal"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal ">
				<div className="modal-box p-4 max-w-2xl">
					<div>
						<h2 className="text-xl font-bold mb-4 text-center">
							{`${item.updateData ? 'Update' : 'Add'} Assignment`}
						</h2>
						<StepsComponent steps={steps} currentStep={step} />
						<form onSubmit={handleSubmit(onFormSubmit)}>
							{/* Step 1 */}
							{step === 1 && (
								<>
									<div className="pb-2">
										<div className="flex justify-between">
											<label
												htmlFor="tech"
												className="block text-sm font-medium text-black"
											>
												Tech
											</label>
											<button
												type="button"
												className="link no-underline hover:underline text-violet-700"
												onClick={() =>
													setAddTech((prevAddTech) => !prevAddTech)
												}
											>
												Add Tech
											</button>
										</div>
										<select
											id="tech"
											className={`select input-bordered w-full mt-1 p-2 ${
												errors.tech ? 'input-error' : null
											}`}
											{...register('tech', {
												required: { value: true, message: 'Tech is required' },
											})}
										>
											<option value={''}>Select Tech</option>
											{tech.map((tech) => (
												<option key={tech.id} value={JSON.stringify(tech)}>
													{tech.name}
												</option>
											))}
										</select>
										<DisplayErrorMsg
											message={errors.tech?.message?.toString()}
										/>
									</div>
									{addTech && (
										<AddTech
											getIsUpdated={handleupdated}
											FormClose={handleCanceled}
										/>
									)}
								</>
							)}

							{/* Step 2 */}
							{step === 2 && (
								<>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<label
												htmlFor="tech"
												className="block text-sm font-medium text-black"
											>
												Tech
											</label>
											<input
												id="tech"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedTech?.name}
												disabled
												readOnly
											/>
										</div>
										<div className="pb-2 ml-1">
											<div className="flex justify-between">
												<label
													htmlFor="techTraining"
													className="block text-sm font-medium text-black"
												>
													Tech Training
												</label>
												<button
													type="button"
													className="link no-underline hover:underline text-violet-700"
													onClick={() =>
														setAddTechTraining((prevAddTech) => !prevAddTech)
													}
												>
													Add Tech Training
												</button>
											</div>
											<select
												id="techTrainingId"
												className={`select input-bordered w-full p-2 ${
													errors.techTrainingId ? 'input-error' : null
												}`}
												{...register('techTrainingId', {
													required: {
														value: true,
														message: 'Tech Training is required',
													},
												})}
											>
												<option value={''}>Select Tech Training</option>
												{techTraining.map((techTraining) => (
													<option
														key={techTraining.id}
														value={JSON.stringify(techTraining)}
													>
														{techTraining.topic} : {techTraining.techId.name}
													</option>
												))}
											</select>
											<DisplayErrorMsg
												message={errors.techTrainingId?.message?.toString()}
											/>
										</div>
									</div>
									{addTechTraining && (
										<AddTechTraining
											getIsUpdated={handleupdated}
											tech={tech}
											FormClose={handleCanceled}
										/>
									)}
								</>
							)}

							{/* Step 3 */}
							{step === 3 && (
								<>
									<div className="grid grid-cols-2">
										<div className="pb-2 mr-1">
											<label
												htmlFor="tech"
												className="block text-sm font-medium text-black"
											>
												Tech
											</label>
											<input
												id="tech"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedTech?.name}
												disabled
												readOnly
											/>
										</div>
										<div className="pb-2 ml-1">
											<label
												htmlFor="topic"
												className="block text-sm font-medium text-black"
											>
												Topic
											</label>
											<input
												id="topic"
												className="input input-bordered w-full mt-1 p-2"
												value={selectedTechTraining?.topic}
												disabled
												readOnly
											/>
										</div>
									</div>
									<div className="pb-">
										<label
											htmlFor="description"
											className="block text-sm font-medium text-black"
										>
											Description
										</label>
										<textarea
											id="description"
											rows={2}
											className="textarea input-bordered w-full p-1"
											value={selectedTechTraining?.description}
											disabled
											readOnly
										/>
									</div>
									<div className="pb-2">
										<label
											htmlFor="level"
											className="block text-sm font-medium text-black"
										>
											Level
										</label>
										<input
											id="level"
											className="input input-bordered w-full mt-1 p-2"
											value={selectedTechTraining?.level}
											disabled
											readOnly
										/>
									</div>
									<div className="pb-1">
										<label
											htmlFor="assignmentTopic"
											className="block text-sm font-medium text-black"
										>
											Assignment Topic <span className="text-red-500">*</span>
										</label>
										<input
											id="assignmentTopic"
											className={`input input-bordered w-full mt-1 p-2 ${
												errors.assignmentTopic ? 'input-error' : null
											}`}
											{...register('assignmentTopic', {
												required: {
													value: true,
													message: 'Topic is required',
												},
											})}
										/>
										<DisplayErrorMsg
											message={errors.assignmentTopic?.message?.toString()}
										/>
									</div>
									<div className="grid grid-cols-2">
										<div className="mr-2 pb-1">
											<label
												htmlFor="duration"
												className="block text-sm font-medium text-black"
											>
												Assignment duration{' '}
												<span className="text-red-500">*</span>
											</label>
											<input
												id="duration"
												type="number"
												placeholder="hours"
												className={`input input-bordered w-full mt-1 p-2 ${
													errors.duration ? 'input-error' : null
												}`}
												{...register('duration', {
													required: {
														value: true,
														message: 'Duration is required',
													},
													min: {
														value: 1,
														message: 'Duration must be greater than 0',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.duration?.message?.toString()}
											/>
										</div>
										<div className="ml-2 pb-1">
											<label
												htmlFor="link"
												className="block text-sm font-medium text-black"
											>
												Assignment link <span className="text-red-500">*</span>
											</label>
											<input
												id="link"
												className={`input input-bordered w-full mt-1 p-2 ${
													errors.link ? 'input-error' : null
												}`}
												{...register('link', {
													required: {
														value: true,
														message: 'Link is required',
													},
												})}
											/>
											<DisplayErrorMsg
												message={errors.link?.message?.toString()}
											/>
										</div>
									</div>
									<div className="grid grid-cols-1">
										<div className="flex justify-between">
											<label
												htmlFor="link"
												className="block text-sm font-medium text-black"
											>
												Evaluation Criteria
												<span className="text-red-500">*</span>
											</label>
											<button
												type="button"
												className="link no-underline hover:underline text-violet-700"
												onClick={() => setAddNewCriteria(true)}
											>
												Add Evaluation Criteria
											</button>
										</div>
										<div className="">
											<div className="mr-2 pb-1 grid grid-cols-3 gap-1">
												{criteria &&
													criteria.map((item: any) => (
														<li key={item.name} className="list-none">
															<p className="flex">
																<input
																	type="checkbox"
																	checked={item.checked}
																	value={JSON.stringify(item)}
																	className="checkbox"
																	{...register('criteria', {
																		required: {
																			value: true,
																			message: 'Criteria is required',
																		},
																	})}
																/>
																<label className="mx-2.5">{item.name}</label>
															</p>
														</li>
													))}
											</div>
											<DisplayErrorMsg
												message={errors.criteria?.message?.toString()}
											/>
										</div>
										{addNewCriteria && (
											<div className="grid grid-cols-2 mt-2">
												<div className="mr-2 pb-1">
													<input
														id="newCriteria"
														type="text"
														placeholder="Criteria"
														className={`input input-bordered w-full mt-1 p-2 ${
															errors.newCriteria ? 'input-error' : null
														}`}
														{...register('newCriteria', {
															required: {
																value: true,
																message: 'New Criteria is required',
															},
														})}
													/>
													<DisplayErrorMsg
														message={errors.newCriteria?.message?.toString()}
													/>
												</div>
												<div className="ml-2 mt-3">
													<button
														className="btn h-8 text-white bg-violet-700 min-h-[2rem] hover:bg-violet-900 hover:text-white ml-2"
														onClick={insertNewCriteria}
														type="button"
													>
														Add
													</button>
													<button
														className="btn focus:outline-none text-white min-h-[2rem] bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium h-8 text-white mr-2"
														onClick={cancelNewCriteria}
														type="button"
													>
														Cancel
													</button>
												</div>
											</div>
										)}
									</div>
								</>
							)}

							<div className="flex justify-end space-x-2 mt-4">
								<label
									htmlFor="addAssignmentModal"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
									onClick={clearForm}
								>
									X
								</label>
								{step === 1 && !addTech && (
									<button
										className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
										type="button"
										onClick={handleNext}
										disabled={!isValid}
									>
										Next
									</button>
								)}
								{step === 2 && !addTechTraining && (
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
							{/* <DevTool control={control} /> */}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddAssignment;
