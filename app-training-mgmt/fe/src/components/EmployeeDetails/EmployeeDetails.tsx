import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { employeeService } from '../../services/employeeService';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

function EmployeeDetails() {
	useDocumentTitle('Employee Profile | Training Management');
	const [employeeData, setEmployeeData] = useState<any>();
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		getEmployeeDetails(id);
	}, []);

	const getEmployeeDetails = async (id: any) => {
		let data: any;
		data = await employeeService.getEmployeesDetails(id);
		if (data) {
			setEmployeeData(data);
		}
	};

	const formatDate = (date: string) => {
		return date ? moment(date).format('DD-MMM-YYYY') : 'NA';
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Employee Profile</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-100 shadow-xl min-h-[47rem]">
				{employeeData ? (
					<div>
						<div className="flex p-2.5">
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Employee Name</span>:
								</div>
								<div className="font-medium w-4/6">{employeeData.name}</div>
							</div>
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Employee Id</span>:
								</div>
								<div className="font-medium w-4/6">{employeeData.id}</div>
							</div>
						</div>
						<div className="flex p-2.5">
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Email</span>:
								</div>
								<div className="font-medium w-4/6">{employeeData.email}</div>
							</div>
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">DOJ</span>:
								</div>
								<div className="font-medium w-4/6">
									{formatDate(employeeData.doj)}
								</div>
							</div>
						</div>
						<div className="flex p-2.5">
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Current Designation</span>:
								</div>
								<div className="font-medium w-4/6">
									{employeeData.currDesignation}
								</div>
							</div>
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Reporting To</span>:
								</div>
								<div className="font-medium w-4/6">
									{employeeData.reportingTo
										? `${employeeData.reportingTo?.name} (${employeeData.reportingTo?.id})`
										: null}
								</div>
							</div>
						</div>
						<div className="flex p-2.5">
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Current Client</span>:
								</div>
								<div className="font-medium w-4/6">
									{employeeData.currClient1}
								</div>
							</div>
							<div className="flex w-3/6">
								<div className="flex w-2/6">
									<span className="w-11/12">Core Tech Stack</span>:
								</div>
								<div className="font-medium w-4/6">
									{employeeData.coreTechStack}
								</div>
							</div>
						</div>
						{employeeData?.certificationAchieved?.length > 0 && (
							<div
								tabIndex={0}
								className="collapse collapse-arrow border border-base-300 my-3.5"
							>
								<input type="checkbox" className="peer" />
								<div className="collapse-title bg-violet-100 p-0 peer-checked:border">
									<h3 className="text-xl p-4 rounded-xl">
										Certification Details
									</h3>
								</div>
								<div className="collapse-content">
									<div className="">
										{employeeData.certificationAchieved.map(
											(certification: any, index: number) => (
												<div key={index} className="mt-2.5 ">
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">
																	Certification Name
																</span>
																:
															</div>
															<div className="font-medium w-4/6">
																{certification.exam.certificationName}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">
																	Certification Link
																</span>
																:
															</div>
															<div className="font-medium w-4/6">
																{certification.certificationLink ? (
																	<Link
																		to={certification.certificationLink}
																		target="_blank"
																		className="link link-primary"
																	>
																		Link
																	</Link>
																) : (
																	'NA'
																)}
															</div>
														</div>
													</div>
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Level</span>:
															</div>
															<div className="font-medium w-4/6">
																{certification.exam.level}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Tech</span>:
															</div>
															<div className="font-medium w-4/6">
																{certification.exam.tech}
															</div>
														</div>
													</div>
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Achieved Date</span>:
															</div>
															<div className="font-medium w-4/6">
																{formatDate(certification.achievedDate)}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Expiry Date</span>:
															</div>
															<div className="font-medium w-4/6">
																{formatDate(certification.expiryDate)}
															</div>
														</div>
													</div>
													{index <
														employeeData.certificationAchieved.length - 1 && (
															<hr className="border-t-2"></hr>
														)}
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}
						{employeeData?.trainingDetail?.length > 0 && (
							<div
								tabIndex={0}
								className="collapse collapse-arrow border border-base-300 my-3.5"
							>
								<input type="checkbox" className="peer" />
								<div className="collapse-title bg-violet-100 p-0 peer-checked:border">
									<h3 className="text-xl p-4 rounded-xl">Training Details</h3>
								</div>
								<div className="collapse-content">
									<div className="">
										{employeeData.trainingDetail.map(
											(batch: any, index: number) => (
												<div key={index} className="mt-2.5 ">
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Batch Title</span>:
															</div>
															<div className="font-medium w-4/6">
																{batch.batchId.batchTitle}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Tech</span>:
															</div>
															<div className="font-medium w-4/6">
																{batch.batchId.tech}
															</div>
														</div>
													</div>
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Status</span>:
															</div>
															<div className="font-medium w-4/6">
																{batch.batchId.status}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Head Trainer</span>:
															</div>
															<div className="font-medium w-4/6">
																{batch.batchId.headTrainer}
															</div>
														</div>
													</div>
													<div className="flex p-2.5">
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">Start Date</span>:
															</div>
															<div className="font-medium w-4/6">
																{formatDate(batch.batchId.startDate)}
															</div>
														</div>
														<div className="flex w-3/6">
															<div className="flex w-2/6">
																<span className="w-11/12">End Date</span>:
															</div>
															<div className="font-medium w-4/6">
																{formatDate(batch.batchId.endDate)}
															</div>
														</div>
													</div>
													{index < employeeData.trainingDetail.length - 1 && (
														<hr className="border-t-2"></hr>
													)}
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}
						<div className="mt-12 justify-center flex">
							<button
								className={`btn bg-violet-800 text-white w-24 hover:bg-violet-900 p-3.5  
						`}
								onClick={() => navigate(-1)}
							>
								Back
							</button>
						</div>
					</div>
				) : (
					<div>Employee does not exists.</div>
				)}
			</div>
		</div>
	);
}

export default EmployeeDetails;
