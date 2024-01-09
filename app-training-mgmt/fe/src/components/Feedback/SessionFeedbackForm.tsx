import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Helper } from '../../utils/helpers';
import { feedbackTraineesService } from '../../services/feedbackTraineesService';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function SessionFeedbackForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		getValues,
	} = useForm<any>({
		mode: 'onTouched',
	});
	useDocumentTitle('Feedback Form | Training Management');
	const [errorMsg, setErrorMsg] = useState('');
	const [questions, setQuestions] = useState<any[]>([]);
	const [tokenData, setTokenData] = useState<any>();
	let [searchParams] = useSearchParams();

	const token = searchParams.get('token');

	useEffect(() => {
		getQuestions();
		if (token) {
			const tokenData = jwtDecode(token);
			setTokenData(tokenData);
		}
	}, []);

	const getQuestions = async () => {
		let quest = await feedbackTraineesService.getQuestions(
			token,
			0,
			'',
			'',
			'',
			''
		);
		if (quest.status && quest.status === 401) {
			setErrorMsg('Feedback form has expired.');
		}
		setQuestions(quest.records);
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');
		data.questions = [];
		questions.forEach((quest) => {
			const answer =
				quest.questionType === 'mcq'
					? JSON.parse(data[quest.id])
					: data[quest.id];
			data.questions.push({ question: quest, answer: answer });
			delete data[quest.id];
		});
		data.batchId = { id: tokenData?.batchId };
		data.empId = { id: tokenData?.username };

		const res: any = await feedbackTraineesService.createFeedback(token, data);
		if (res.status === 201) {
			Helper.showToastMessage(
				'Feedback form submitted successfully',
				'success'
			);
			clearForm();
		} else {
			Helper.showToastMessage(
				'You already submitted the feedback form.',
				'error'
			);
		}
	};

	const clearForm = () => {
		reset();
	};

	return (
		<>
			{!errorMsg ? (
				<div className="w-6/12 mt-10 card border-solid pt-0 m-auto border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
					<div className="flex justify-center my-8 ">
						<h1 className="font-bold text-3xl">Feedback Form</h1>
					</div>
					<div className="p-4">
						<p className="mb-6">
							Hi {tokenData?.name}. Kindly give your feedback for the{' '}
							<span className="font-medium">{tokenData?.batchName}</span>{' '}
							session that you had attended.
						</p>
						<div>
							<form onSubmit={handleSubmit(onFormSubmit)}>
								<div>
									{questions &&
										questions.map((quest, index) => (
											<div key={index}>
												{quest.questionType === 'mcq' ? (
													<div className="mb-5">
														<label
															htmlFor="batchAssignment"
															className="block text-base font-medium text-black"
														>
															{index + 1}. {quest.questionText}{' '}
															<span className="text-red-500"> *</span>
														</label>
														{quest.option.map((opt: any, index: any) => (
															<div
																className="form-control w-60 pl-3.5"
																key={index}
															>
																<label className="label cursor-pointer justify-start">
																	<input
																		id={opt}
																		type="radio"
																		className="radio checked:bg-violet-800"
																		value={JSON.stringify(opt)}
																		{...register(quest.id, {
																			required: {
																				value: true,
																				message: 'Answer is required',
																			},
																		})}
																	/>
																	<span className="label-text pl-2.5 text-base">
																		{opt.optionText}
																	</span>
																</label>
															</div>
														))}
														<DisplayErrorMsg
															message={errors[quest.id]?.message?.toString()}
														/>
													</div>
												) : (
													<div>
														<div className="">
															<label
																htmlFor="batchAssignment"
																className="block text-base font-medium text-black"
															>
																{index + 1}. {quest.questionText}
															</label>
															<textarea
																id={quest.id}
																rows={2}
																className="textarea input-bordered w-full p-1"
																{...register(quest.id, {
																	required: {
																		value: true,
																		message: 'Answer is required',
																	},
																})}
															/>
														</div>
														<DisplayErrorMsg
															message={errors.answerText?.message?.toString()}
														/>
													</div>
												)}
											</div>
										))}
								</div>
								<div className="flex justify-center space-x-2 mt-4">
									<button
										className="btn w-36 text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
										type="submit"
										disabled={!isDirty || !isValid}
									>
										Save
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			) : (
				<div className="w-6/12 mt-10 card border-solid justify-center pt-0 m-auto border-2 p-5 bg-base-100 shadow-xl min-h-[17rem]">
					<h3 className="font-bold text-3xl text-center">{errorMsg}</h3>
				</div>
			)}
		</>
	);
}

export default SessionFeedbackForm;
