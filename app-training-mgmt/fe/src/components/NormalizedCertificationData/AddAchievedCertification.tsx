import React, { useEffect, useRef, useState } from 'react';
import { employeeService } from '../../services/employeeService';
import { NormalizedEmployeeInterface } from '../../interfaces/normalizedEmployeeInterface';
import { certificationService } from '../../services/certificationService';
import {
	NormalizedAchievedCertificationInterface,
	NormalizedApprovedCertificationInterface,
} from '../../interfaces/normalizedCertificationInterface';
import { useForm } from 'react-hook-form';
import DisplayErrorMsg from '../Common/DisplayErrorMsg';
import { Helper } from '../../utils/helpers';
interface PropOptions {
	getIsUpdated: (isUpdated: boolean) => void;
}

const InitialFormValue = {
	empId: {
		id: '',
		name: '',
		email: '',
		doj: '',
		reportingTo: '',
		currDesignation: '',
		currClient1: '',
		currClient2: '',
		currClient3: '',
		currClient4: '',
		coreTechStack: '',
		secondaryTechStack: '',
		status: '',
	},
	exam: {
		id: '',
		certificationName: '',
		tech: '',
		level: '',
		costInDollars: undefined,
	},
	achievedDate: null,
	expiryDate: null,
	certificationLink: '',
};
function AddAchievedCertification(item: PropOptions) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
		reset,
		setValue,
	} = useForm<NormalizedAchievedCertificationInterface>({
		mode: 'onTouched',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [formData, setFormData] =
		useState<NormalizedAchievedCertificationInterface>(InitialFormValue);
	const [employees, setEmployees] = useState<NormalizedEmployeeInterface[]>([]);
	const [exam, setExam] = useState<any>([]);
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const fetchedEmployees = await employeeService.getActiveEmployees();
		setEmployees(fetchedEmployees);

		const fetchedExams = await certificationService.getCertifications(
			'normalizeApproved',
			0,
			'',
			'',
			''
		);
		setExam(fetchedExams.records);
	};

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		if (name === 'exam') {
			const selectedObject = JSON.parse(value);
			setFormData({
				...formData,
				[name]: selectedObject,
			});
		}
	};

	const onFormSubmit = async (data: any) => {
		if (errorMsg) setErrorMsg('');

		if (data.expiryDate === '') data.expiryDate = null;
		data.empId = JSON.parse(data.empId);
		data.exam = JSON.parse(data.exam);
		if (!data.certificationLink) {
			delete data.certificationLink;
		}
		const res: any = await certificationService.createCertification(
			'normalizeAchieved',
			data
		);
		if (res.status === 201) {
			//Display message
			Helper.showSavedAlert();
			item.getIsUpdated(true);
			//Reset the form
			clearForm();

			if (checkboxRef.current) {
				checkboxRef.current.checked = false;
			}
		} else {
			Helper.showErrorAlert();
		}
	};
	const clearForm = () => {
		reset();
	};

	return (
		employees &&
		exam && (
			<>
				<input
					type="checkbox"
					id="my_modal_7"
					className="modal-toggle"
					ref={checkboxRef}
				/>
				<div className="modal">
					<div className="modal-box p-4">
						<h3 className="text-xl font-bold mb-4">
							Add New Achieved certification
						</h3>
						<form onSubmit={handleSubmit(onFormSubmit)}>
							<div className="pb-2">
								<label
									htmlFor="empId"
									className="block text-sm font-medium text-black"
								>
									Employee <span className="text-red-500">*</span>
								</label>
								<select
									id="empId"
									className={`select input-bordered w-full mt-1 p-2 ${
										errors.empId ? 'input-error' : null
									}`}
									{...register('empId', {
										required: { value: true, message: 'Employee is required' },
									})}
								>
									<option value={''}>Select an Employee</option>
									{employees.map((emp) => (
										<option key={emp.id} value={JSON.stringify(emp)}>
											{emp.name} : {emp.id}
										</option>
									))}
								</select>
								<DisplayErrorMsg message={errors.empId?.message?.toString()} />
							</div>
							<div className="pb-2">
								<label
									htmlFor="exam"
									className="block text-sm font-medium text-black"
								>
									Certification <span className="text-red-500">*</span>
								</label>
								<select
									id="exam"
									className={`select input-bordered w-full mt-1 p-2 ${
										errors.exam ? 'input-error' : null
									}`}
									{...register('exam', {
										required: {
											value: true,
											message: 'Certification is required',
										},
									})}
									onChange={handleInputChange}
								>
									<option value={''}>Select certification</option>
									{exam.map(
										(exam: NormalizedApprovedCertificationInterface) => (
											<option key={exam.id} value={JSON.stringify(exam)}>
												{exam.certificationName}
											</option>
										)
									)}
								</select>
								<DisplayErrorMsg message={errors.exam?.message?.toString()} />
							</div>
							<div className="grid grid-cols-2">
								<div className="pb-2 mr-2">
									<label
										htmlFor="Tech"
										className="block text-sm font-medium text-black"
									>
										Tech
									</label>
									<input
										type=" text"
										className="input mt-1 p-2 w-full border-gray-300"
										value={formData.exam?.tech}
										disabled
									/>
								</div>
								<div className="pb-2 ml-2">
									<label
										htmlFor="level"
										className="block text-sm font-medium text-black"
									>
										Level
									</label>
									<input
										type="text"
										className="input mt-1 p-2 w-full border-gray-300"
										value={formData.exam?.level}
										disabled
									/>
								</div>
							</div>
							<div className="grid grid-cols-2">
								<div className="pb-2 mr-2">
									<label
										htmlFor="achievedDate"
										className="block text-sm font-medium text-black"
									>
										Achieved Date <span className="text-red-500">*</span>
									</label>
									<input
										type="date"
										id="achievedDate"
										className={`input input-bordered w-full mt-1 p-2 ${
											errors.achievedDate ? 'input-error' : null
										}`}
										{...register('achievedDate', {
											required: {
												value: true,
												message: 'Achieved Date is required',
											},
										})}
									/>
									<DisplayErrorMsg
										message={errors.achievedDate?.message?.toString()}
									/>
								</div>
								<div className="pb-2 ml-2">
									<label
										htmlFor="expiryDate"
										className="block text-sm font-medium text-black"
									>
										Expiry Date
									</label>
									<input
										type="date"
										id="expiryDate"
										className={`input input-bordered w-full mt-1 p-2 `}
										{...register('expiryDate')}
									/>
								</div>
							</div>
							<div className="pb-2">
								<label
									htmlFor="certificationLink"
									className="block text-sm font-medium text-black"
								>
									Certification Link
								</label>
								<input
									type="text"
									id="certificationLink"
									className={`input input-bordered w-full mt-1 p-2 `}
									{...register('certificationLink')}
								/>
							</div>

							<div className="flex justify-end space-x-2 mt-4">
								<label
									htmlFor="my_modal_7"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
									onClick={clearForm}
								>
									X
								</label>
								<button
									className="btn w-full text-white bg-violet-700 hover:bg-violet-900 hover:text-white"
									type="submit"
									disabled={!isDirty || !isValid}
								>
									Save
								</button>
							</div>
						</form>
					</div>
					<label
						className="modal-backdrop"
						htmlFor="my_modal_7"
						onClick={clearForm}
					></label>
				</div>
			</>
		)
	);
}

export default AddAchievedCertification;
