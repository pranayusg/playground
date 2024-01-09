import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { Helper } from '../../utils/helpers';
import { useEffect, useState } from 'react';

export interface Props {
	apiData: any;
	fileName: string;
}

const swalProps = {
	title: 'Do you want to export data?',
	icon: 'info',
	confirmButtonText: 'Yes, export it!',
};

export const ExportToExcel = ({ apiData, fileName }: Props) => {
	const [disableBtn, setDisableBtn] = useState(false);

	useEffect(() => {
		if (apiData.length === 0) setDisableBtn(true);
		else setDisableBtn(false);
	}, [apiData]);

	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const showExpertAlert = async () => {
		const result = await Helper.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) exportToCSV();
	};

	const exportToCSV = () => {
		const headers = Object.keys(apiData[0]);

		headers.forEach((header: string, index: number) => {
			headers[index] = Helper.camelToFlat(header);
		});

		const ws = XLSX.utils.json_to_sheet([]);

		const Heading = [];
		Heading.push(headers);
		XLSX.utils.sheet_add_aoa(ws, Heading);

		//Starting in the second row to avoid overriding and skipping headers
		XLSX.utils.sheet_add_json(ws, apiData, { origin: 'A2', skipHeader: true });

		// Make first row of headers bold
		for (let i = 0; i < headers.length; i++) {
			const cell = ws[XLSX.utils.encode_cell({ r: 0, c: i })];

			if (!cell.s) {
				cell.s = {};
			}
			if (!cell.s.font) {
				cell.s.font = {};
			}
			// Set bold
			cell.s.font.bold = true;
		}

		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	return (
		<button
			className={`btn capitalize `}
			disabled={disableBtn}
			onClick={(e) => showExpertAlert()}
			title="Export data"
		>
			{disableBtn ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1.4em"
					viewBox="0 0 576 512"
					fill="#697996"
				>
					<path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V288H216c-13.3 0-24 10.7-24 24s10.7 24 24 24H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM384 336V288H494.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39H384zm0-208H256V0L384 128z" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1.4em"
					viewBox="0 0 576 512"
				>
					<path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V288H216c-13.3 0-24 10.7-24 24s10.7 24 24 24H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM384 336V288H494.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39H384zm0-208H256V0L384 128z" />
				</svg>
			)}
		</button>
	);
};
