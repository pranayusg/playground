import { Helper } from '../../utils/helpers';

const SummaryButtonRenderer = (props: any) => {
	// Define the click event handler for the button here
	const viewSummary = () => {
		Helper.getSummaryPopup(props.data.summary);
	};

	return props?.data?.summary ? (
		<button className="link link-primary" onClick={viewSummary}>
			View Summary
		</button>
	) : (
		<button disabled>No Summary</button>
	);
};

export default SummaryButtonRenderer;
