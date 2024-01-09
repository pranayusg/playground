import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Tech } from '../../interfaces/assignmnetInterface';
import { assignmentService } from '../../services/assignmnetService';
import { Helper } from '../../utils/helpers';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	FormClose: (isClosed: boolean, form: string) => void;
}

function AddTech(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
	} = useForm<Tech>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [parentTech, setParentTechs] = useState<Tech[]>([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const fetchTechs: any = await assignmentService.getAllTech(0, '', '', '');
		setParentTechs(fetchTechs.records);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		data.parent = JSON.parse(data.parent);
		if (!data.parent?.id || !data.parent) {
			delete data.parent;
		}

		const res: any = await assignmentService.createTech(data);

		if (res.status === 201) {
			Helper.showSavedAlert();
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
		parentTech && (
			<>
				<div>
					<h2 className="text-lg font-bold mb-4">Add Tech</h2>

					<div className="py-1">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-black"
						>
							Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							className={`input input-bordered w-full ${
								errors.name ? 'input-error' : null
							}`}
							{...register('name', {
								required: {
									value: true,
									message: 'Batch Title is required',
								},
							})}
						/>
						<DisplayErrorMsg message={errors.name?.message?.toString()} />
					</div>
					<div className="py-1">
						<label
							htmlFor="parent"
							className="block text-sm font-medium text-black"
						>
							Parent Tech
						</label>

						<select
							id="parent"
							className="select mt-1 p-2 w-full border border-gray-300"
							{...register('parent')}
						>
							<option value={JSON.stringify({})}>Select parent Tech</option>
							{parentTech.map((tech) => (
								<option key={tech.id} value={JSON.stringify(tech)}>
									{tech.name}
								</option>
							))}
						</select>
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
							<button
								className="btn focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium w-full text-white mr-2"
								onClick={() => item.FormClose(true, 'tech')}
							>
								Cancel
							</button>
							<button
								className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white ml-2"
								type="submit"
								disabled={!isDirty || !isValid}
								onClick={handleSubmit(onFormSubmit)}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</>
		)
	);
}

export default AddTech;
