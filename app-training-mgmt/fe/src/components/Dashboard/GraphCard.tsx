function GraphCard({ heading, component, width }: any) {
	return (
		<div
			className={`border-solid border-2 shadow-lg mt-4 p-4 bg-base-100 rounded-box ${width}`}
		>
			<h1 className="text-xl font-semibold text-center">{heading}</h1>
			<div className="divider mt-2"></div>
			<>{component}</>
		</div>
	);
}

export default GraphCard;
