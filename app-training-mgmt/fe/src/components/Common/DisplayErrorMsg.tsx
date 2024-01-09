interface DisplayErrorMsgProps {
	message: string | undefined;
	centerAlign?: boolean;
}

const DisplayErrorMsg = (props: DisplayErrorMsgProps) => {
	return (
		<p
			className={`text-rose-800 m-2 ${
				props.centerAlign ? 'text-center' : null
			}`}
		>
			{props.message ?? ''}
		</p>
	);
};

export default DisplayErrorMsg;
