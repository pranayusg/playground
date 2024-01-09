import { useRef } from 'react';
import { useForm } from 'react-hook-form';

function ViewTraineeFeedbackResponse(data: any) {
	const { reset } = useForm<any>({
		mode: 'onTouched',
	});
	const checkboxRef = useRef<HTMLInputElement>(null);

	const clearForm = () => {
		reset();
	};

	return (
		<>
			<input
				type="checkbox"
				id="viewTraineeFeedbackResponse"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			{data.feedbackData && (
				<div className="modal ">
					<div className="modal-box p-4 max-w-2xl">
						<div>
							<h2 className="text-xl font-bold mb-4 text-center">
								Trainee Feedback
							</h2>
							<div className="flex justify-between p-2.5">
								<div>
									<span className="font-medium ">Session:</span>{' '}
									{data.feedbackData.techTopic}
								</div>
								<div>
									<span className="font-medium ">Trainee: </span>
									{data.feedbackData.name}
								</div>
							</div>
							<div>
								<table className="table">
									<thead className="text-black">
										<tr>
											<th className="text-sm font-medium text-black w-4/6">
												Question
											</th>
											<th className="text-sm font-medium text-black">
												Response
											</th>
										</tr>
									</thead>
									<tbody className="">
										{data.feedbackData &&
											data.feedbackData.feedbackData.map(
												(quest: any, index: number) => (
													<tr key={index}>
														<td className="py-2">
															<div className="flex items-center gap-3 text-base">
																{quest.questionId.questionText}
															</div>
														</td>
														<td className="py-2">
															<div className="flex items-center gap-3 text-base">
																{quest.answertext
																	? quest.answertext
																	: quest.answerOptionId.optionText}
															</div>
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</div>
							<div className="flex justify-end space-x-2 mt-4">
								<label
									htmlFor="viewTraineeFeedbackResponse"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
									onClick={clearForm}
								>
									X
								</label>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default ViewTraineeFeedbackResponse;
