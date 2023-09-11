import Swal from 'sweetalert2';
import { Summary } from '../interfaces/summaryInterface';

const keyNameMapping: any = {
	sheetName: 'Sheet Name',
	rowsInserted: 'Rows Inserted',
	rowsUpdated: 'Rows Updated',
	rowsRejected: 'Rows Rejected',
};

export const SummaryHelper = {
	getSummaryPopup: async (props: Summary[]) => {
		const propsText = props
			.map((item, index) => {
				const objectText = Object.entries(item)
					.map(([key, value]) => {
						const customKeyName = keyNameMapping[key] || key;
						return `${customKeyName}: <strong>${value}</strong>`;
					})
					.join('\n');
				return `${index + 1}. ${objectText}\n`;
			})
			.join('\n');

		let result = await Swal.fire({
			confirmButtonText: 'Close',
			title: 'Summary',
			html: `<pre>${propsText}</pre>`,
			width: 450,
			heightAuto: true,
		});
		return result;
	},
};
