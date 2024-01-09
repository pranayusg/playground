import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Theme from '../Theme/Theme';
import {
	selectNoOfRecords,
	setNoOfRecords,
} from '../../store/features/globalSlice';
import { PAGE_OPTIONS } from '../../constants/constants';

const Settings = () => {
	const dispatch = useDispatch();
	const checkboxRef = useRef<HTMLInputElement>(null);
	const noOfRecords = useSelector(selectNoOfRecords);

	const setSelectedRecords = async (count: number) => {
		dispatch(setNoOfRecords(count));
	};

	return (
		<>
			<input
				type="checkbox"
				id="my_modal_6"
				className="modal-toggle"
				ref={checkboxRef}
			/>
			<div className="modal">
				<div className="modal-box p-4">
					<h3 className="text-xl font-bold mb-4">Settings</h3>
					<form>
						<div className="py-2 flex items-center">
							<label
								htmlFor="theme"
								className="block text-sm font-medium text-black mr-5"
							>
								Theme
							</label>
							<Theme />
						</div>
						<div className="py-2 flex items-center">
							<label
								htmlFor="records"
								className="block text-sm font-medium text-black mr-5"
							>
								No. of records per page in Grid
							</label>
							<select
								className="select select-bordered"
								onChange={(e: any) => setSelectedRecords(e.target.value)}
								name="noOfRecords"
								defaultValue={noOfRecords}
								key={noOfRecords}
							>
								{PAGE_OPTIONS.map((value: number, index: number) => (
									<option key={index} value={value}>
										{value}
									</option>
								))}
							</select>
						</div>
						<div className="flex justify-end space-x-2 mt-4"></div>
					</form>
				</div>
				<label className="modal-backdrop" htmlFor="my_modal_6"></label>
			</div>
		</>
	);
};

export default Settings;
