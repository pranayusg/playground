import { ChangeEvent, useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function UploadExcel() {
	useDocumentTitle('Import | Training Management');
	const [file, setFile] = useState<File>();
	const [fileUploadStatus, setFileUploadStatus] = useState(false);
	const uploadTypes = ['Employee Master', 'Training Details', 'Certifications'];
	const [uploadType, setUploadType] = useState('');
	const [errMsg, setErrMsg] = useState<string>('');
	const [restrictUserError, setRestrictUserError] = useState<string>('');
	const [jobs, setJobData] = useState<any>([]);

	useEffect(() => {
		getJobs();
	}, [fileUploadStatus]);

	const getJobs = async () => {
		let data = await jobService.getJobsWithStatus(1, '');
		setJobData(data.records);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (fileUploadStatus === true) {
			setFileUploadStatus(false);
		}
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
		setErrMsg('');
	};

	const handleUploadClick = async () => {
		let uploadFileRes;
		if (!file) {
			return;
		}

		if (uploadType === uploadTypes[0]) {
			uploadFileRes = await jobService.uploadEmployeeMasterFile(file);
		} else if (uploadType === uploadTypes[1]) {
			uploadFileRes = await jobService.uploadFile(file);
		} else if (uploadType === uploadTypes[2]) {
			uploadFileRes = await jobService.uploadCertificationFile(file);
		}
		if (uploadFileRes?.jobId) {
			setFileUploadStatus(true);
		}

		if (uploadFileRes?.status === 400) {
			setErrMsg(uploadFileRes.data.message);
		}
	};

	const handleImportType = (e: any) => {
		const importType = e.target.value;

		const employeeFileUploaded =
			jobs.length &&
			jobs.find((item: any) => item.importType === 'Employee Master');
		setUploadType(importType);
		setErrMsg('');
		setRestrictUserError('');
		setFileUploadStatus(false);
		if (!employeeFileUploaded && importType && importType !== uploadTypes[0]) {
			setRestrictUserError(
				`Kindly upload Employee master file before uploading ${importType}.`
			);
		}
	};
	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Import</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl">
				<div className="space-x-4">
					<span>Import type</span>
					<select
						className="select select-bordered max-w-xs"
						onChange={handleImportType}
						name="uploadType"
					>
						<option value={''}>Select File Type</option>
						{uploadTypes.map((value: string, index: number) => (
							<option key={index} value={value}>
								{value}
							</option>
						))}
					</select>
				</div>
				<div className="card-body self-center w-1/2 m-10 border-2 rounded-lg items-center text-center">
					<div className="w-1/2 m-auto">
						<input
							type="file"
							accept=".xlsx"
							className="file-input file-input-bordered  w-full max-w-xs"
							onChange={handleFileChange}
							disabled={uploadType && !restrictUserError ? false : true}
						/>
					</div>
					<div className="card-actions">
						<button
							className={`btn bg-blue-600 p-3.5 mt-4 text-white
						${file?.type.includes('spreadsheet')
									? 'bg-sky-700 hover:text-white hover:bg-blue-500'
									: 'bg-sky-400 '
								}`}
							onClick={handleUploadClick}
							disabled={
								!file?.type.includes('spreadsheet') ||
									restrictUserError ||
									!uploadType
									? true
									: false
							}
						>
							Import
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

					{errMsg || restrictUserError ? (
						<div className="text-red-700 mt-4 w-1/2 m-auto">
							{errMsg || restrictUserError}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default UploadExcel;
