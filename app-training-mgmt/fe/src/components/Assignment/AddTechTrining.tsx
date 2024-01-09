import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Tech, TechTraining } from '../../interfaces/assignmnetInterface';
import { assignmentService } from '../../services/assignmnetService';
import { Helper } from '../../utils/helpers';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	tech: Tech[];
	FormClose: (isClosed: boolean, form: string) => void;
}

function AddTechTraining(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
	} = useForm<TechTraining>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [tech, setTech] = useState<Tech[]>(item.tech);

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');

		data.techId = JSON.parse(data.techId);

		const res: any = await assignmentService.createTechTraining(data);

		if (res.status === 201) {
			//Display toast message
			Helper.showSavedAlert();
			//Reset the form
			item.getIsUpdated(true);

			clearForm();
		} else {
			Helper.showErrorAlert();
		}
	};

	const clearForm = () => {
		reset();
	};

	return (
		tech && (
			<div>
				<h2 className="text-lg font-bold mb-1">Add Tech Training</h2>
				<div className="grid grid-cols-2">
					<div className="py-1 mr-1">
						<label
							htmlFor="techId"
							className="block text-sm font-medium text-black"
						>
							Tech <span className="text-red-500">*</span>
						</label>

						<select
							id="techId"
							className={`select input-bordered w-full mt-1 p-2 ${
								errors.techId ? 'input-error' : null
							}`}
							{...register('techId', {
								required: {
									value: true,
									message: 'Tech is required',
								},
							})}
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

					<div className="py-1 ml-1">
						<label
							htmlFor="topic"
							className="block text-sm font-medium text-black"
						>
							Topic <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="topic"
							className={`input input-bordered w-full mt-1 ${
								errors.topic ? 'input-error' : null
							}`}
							{...register('topic', {
								required: {
									value: true,
									message: 'topic is required',
								},
							})}
						/>
						<DisplayErrorMsg message={errors.topic?.message?.toString()} />
					</div>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-black"
					>
						Description <span className="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						rows={2}
						className={`textarea input-bordered w-full ${
							errors.description ? 'input-error' : null
						}`}
						{...register('description', {
							required: {
								value: true,
								message: 'description is required',
							},
						})}
					/>
					<DisplayErrorMsg message={errors.description?.message?.toString()} />
				</div>
				<div className="grid grid-cols-2">
					<div className=" mr-1">
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
									message: 'level is required',
								},
							})}
						/>
						<DisplayErrorMsg message={errors.level?.message?.toString()} />
					</div>
				</div>
				{/* Add 'Save' and 'Close' buttons */}
				<div className="flex justify-end space-x-2 mt-2">
					<label
						htmlFor="addTech"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={clearForm}
					>
						X
					</label>
					<div className="grid grid-cols-2 w-full">
						<div className="mr-1">
							<button
								className="btn focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium w-full text-white"
								onClick={() => item.FormClose(true, 'techTraining')}
							>
								Cancel
							</button>
						</div>
						<div className="ml-1">
							<button
								className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
								type="submit"
								disabled={!isDirty || !isValid}
								onClick={handleSubmit(onFormSubmit)}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	);
}

export default AddTechTraining;
