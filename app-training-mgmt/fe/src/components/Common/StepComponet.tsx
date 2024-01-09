interface PropOptions {
	steps: any;
	currentStep: any;
}
const StepsComponent = ({ steps, currentStep }: PropOptions) => {
	return (
		<div className="flex w-full justify-center items-center mb-3">
			<div className="steps steps-horizontal w-full">
				{steps.map((step: any) => {
					let stepClasses = 'step';

					if (step.id === currentStep) {
						stepClasses += ' step-primary';
					} else if (step.id < currentStep) {
						stepClasses += ' step-success';
					}

					return (
						<div key={step.id} className={stepClasses}>
							<div className="step-title">{step.title}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StepsComponent;
