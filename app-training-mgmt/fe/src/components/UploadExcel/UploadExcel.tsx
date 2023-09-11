import { ChangeEvent, useState } from 'react';
import { jobService } from '../../services/jobService';

function UploadExcel() {
	const [file, setFile] = useState<File>();
	const [fileUploadStatus, setFileUploadStatus] = useState(false);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (fileUploadStatus === true) setFileUploadStatus(false);
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}

		const uploadFileRes = await jobService.uploadFile(file);

		if (uploadFileRes.jobId) {
			setFileUploadStatus(true);
		}
	};
	return (
		<div className="w-3/4 m-40 card border-solid border-2 border-sky-700 p-5 bg-base-100 shadow-xl">
			<div className="card-body items-center text-center">
				<h2 className="card-title mb-4">Upload an Excel file</h2>
				<div className="w-1/2 m-auto">
					<input
						type="file"
						accept=".xlsx"
						className="file-input file-input-bordered file-input-primary w-full max-w-xs"
						onChange={handleFileChange}
					/>
				</div>
				<div className="card-actions">
					<button
						className={`btn btn-primary p-1.5 mt-4 text-white
					${
						file?.type.includes('spreadsheet')
							? 'bg-sky-700 hover:text-white hover:bg-sky-900'
							: 'bg-sky-400 '
					}`}
						onClick={handleUploadClick}
						disabled={!file?.type.includes('spreadsheet')}
					>
						Upload
					</button>
				</div>
				{file && !file?.type.includes('spreadsheet') ? (
					<div className="text-red-700 mt-4 w-1/2 m-auto">
						Please select an excel file to upload.
					</div>
				) : null}

				{fileUploadStatus ? (
					<div className="text-green-700 mt-4 w-1/2 m-auto">
						File uploaded successfully.
					</div>
				) : null}
			</div>
		</div>
	);
}

export default UploadExcel;
