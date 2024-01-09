import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { batchService } from '../../services/batchService';
import { feedbackTraineesService } from '../../services/feedbackTraineesService';
import { Helper } from '../../utils/helpers';

interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
	isTrainer: boolean;
}

function GenerateFeedbackForm(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		getValues,
	} = useForm<any>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [batches, setBatches] = useState<any[]>([]);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const checkboxRef = useRef<HTMLInputElement>(null);
	const noOfDays = [1, 2, 3, 4, 5];

	useEffect(() => {
		setIsUpdated(false);
		getBatchTree();
	}, [isUpdated]);

	const getBatchTree = async () => {
		const data = await batchService.getBatchTree(item.isTrainer ? true : false);
		let batchesArray: any = [];
		data
			.filter(
				(item: any) =>
					item.status === 'Completed' &&
					!item.headTrainer.includes('Self Learning') &&
					!item.formGenerated
			)
			.forEach((item: any) => {
				item.title = item.techTopic;
				if (item.children.length) {
					item.children.forEach((child: any) => {
						child.title = child.techTopic;
						batchesArray.push({ ...child });
					});
				} else {
					batchesArray.push(item);
				}
			});
		setBatches(batchesArray);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		const id = data.batch;
		delete data.batch;
		const res: any = await feedbackTraineesService.generateFeedbackForm(
			id,
			data
		);
		if (res.status === 201) {
			Helper.showSavedAlert('Feedback form email sent successfully!');
			item.getIsUpdated(true);
			setIsUpdated(true);
			clearForm();
			if (checkboxRef.current) {
				checkboxRef.current.checked = false;
			}
		} else {
			Helper.showToastMessage(res.data.message, 'error');
		}
	};

	const clearForm = () => {
		reset();
	};

	return (
		<>
			<input
				type="checkbox"
				id="generateFeedbackFormModal"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal ">
				<div className="modal-box p-4 max-w-2xl">
					<div>
						<h2 className="text-xl font-bold mb-4 text-center">
							Generate Feedback form
						</h2>
						<form onSubmit={handleSubmit(onFormSubmit)}>
							<div className="grid grid-cols-2">
								<div className="pb-2 mr-1">
									<div className="flex justify-between">
										<label
											htmlFor="batch"
											className="block text-sm font-medium text-black"
										>
											Select Batch
										</label>
									</div>
									<select
										id="batch"
										className={`select input-bordered w-full mt-1 p-2 ${
											errors.batch ? 'input-error' : null
										}`}
										{...register('batch', {
											required: {
												value: true,
												message: 'Batch is required',
											},
										})}
									>
										<option value={''}>Select Batch</option>
										{batches.map((batch) => (
											<option key={batch.id} value={batch.id}>
												{batch.title}
											</option>
										))}
									</select>
									<DisplayErrorMsg
										message={errors.batch?.message?.toString()}
									/>
								</div>
								<div className="pb-2 ml-1">
									<div className="flex justify-between">
										<label
											htmlFor="validity"
											className="block text-sm font-medium text-black"
										>
											Validity of feedback form
										</label>
									</div>
									<select
										id="validity"
										className={`select input-bordered w-full mt-1 p-2 ${
											errors.validity ? 'input-error' : null
										}`}
										{...register('validity', {
											required: {
												value: true,
												message: 'Validity of feedback form is required',
											},
										})}
									>
										<option value={''}>Select validity</option>
										{noOfDays.map((day) => (
											<option key={day} value={day}>
												{`${day} day${day <= 1 ? '' : 's'}`}
											</option>
										))}
									</select>
									<DisplayErrorMsg
										message={errors.validity?.message?.toString()}
									/>
								</div>
							</div>

							<div className="flex justify-center space-x-2 mt-4">
								<label
									htmlFor="generateFeedbackFormModal"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
									onClick={clearForm}
								>
									X
								</label>
								<button
									className="btn text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
									type="submit"
									disabled={!isDirty || !isValid}
								>
									Generate feedback form
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default GenerateFeedbackForm;
