import Swal from 'sweetalert2';

const RatingsPopupRenderer = (props: any) => {
	const viewSummary = async () => {
		await Swal.fire({
			confirmButtonText: 'Close',
			title: 'Ratings',
			heightAuto: true,
			html: `<table style="margin: auto; width: 60%; height:150px;" className="table">
		    <thead className="text-black">
		        <tr>
		            <th style="text-align: left;">
		                Criteria
		            </th>
		            <th>
		                Rating
		            </th>
		        </tr>
		    </thead>
		    <tbody>
		        ${Object.keys(props.data.rating)
							.map(
								(rating: any, index) =>
									`<tr>
										<td className="py-2 text-left">
											<div style="text-align: left; font-size:16px" className="flex gap-3 text-base">
												${rating}
											</div>
										</td>
										<td className="py-2 text-left">
											<div style="font-size:16px" className="flex gap-3 text-base">
												${props.data.rating[rating]}
											</div>
										</td>
									</tr>`
							)
							.join('\n')}
		    </tbody>
		</table>`,
			width: 530,
		});
	};

	return props?.data?.rating ? (
		<button className="link link-primary" onClick={viewSummary}>
			View Ratings
		</button>
	) : (
		<button disabled>No Ratings</button>
	);
};

export default RatingsPopupRenderer;
