import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './BatchCalender.css';
import { Batch } from '../../interfaces/batchInterface';
import { View } from 'react-calendar/dist/cjs/shared/types';

const getDate = (date: any) => {
	return new Date(date.length > 0 ? date[0] : date);
};

const BatchCalender = ({
	batchData,
	period,
}: {
	batchData: Batch[];
	period: number;
}) => {
	const [date, setDate] = useState<any>(new Date());
	const [isBatchChange, setIsBatchChange] = useState(false);
	const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
	const [view, setView] = useState<View>('month');

	useEffect(() => {
		if (batchData.length && !isBatchChange) {
			const selectedDate = getDate(date);

			setFilteredBatches(
				batchData.filter(
					(batch) =>
						selectedDate.getMonth() === new Date(batch.startDate).getMonth() &&
						selectedDate.getFullYear() ===
							new Date(batch.startDate).getFullYear()
				)
			);
		}
	}, [date, isBatchChange]);

	useEffect(() => {
		if (filteredBatches.length)
			handleBatchChange(
				JSON.stringify({
					startDate: filteredBatches[0].startDate,
					endDate: filteredBatches[0].endDate,
				})
			);
	}, [filteredBatches]);

	useEffect(() => {
		console.log(period);
		if (period === 12) setView('year');
		else setView('month');
	}, [period]);

	const handleDateChange = (date: any) => {
		setIsBatchChange(false);
		setDate(date);
	};

	const handleBatchChange = (e: any) => {
		setIsBatchChange(true);
		const dateRange = e.target ? JSON.parse(e.target.value) : JSON.parse(e);

		if (
			dateRange.startDate &&
			(dateRange.startDate === dateRange.endDate || dateRange.endDate == null)
		)
			setDate(new Date(dateRange.startDate));
		else setDate([new Date(dateRange.startDate), new Date(dateRange.endDate)]);
	};

	return (
		<div className="text-center flex gap-2 justify-evenly mb-2">
			<div key={view + Math.random()}>
				<Calendar
					key={view + Math.random()}
					className="border-solid border-2 rounded-lg"
					onChange={handleDateChange}
					value={date}
					// selectRange={true}
					onClickMonth={handleDateChange}
					defaultView={view}
				/>
				{date.length > 0 ? (
					<p className="text-center mt-2">
						<span className="font-bold">Start:</span> {date[0].toDateString()}
						&nbsp;|&nbsp;
						<span className="font-bold">End:</span> {date[1].toDateString()}
					</p>
				) : (
					<p className="text-center mt-2">
						{filteredBatches.length ? (
							<>
								<span className="font-bold">Start:</span> {date.toDateString()}
								&nbsp;|&nbsp;
								<span className="font-bold">End:</span> {date.toDateString()}
							</>
						) : (
							<>
								<span className="font-bold">Selected date:</span>{' '}
								{date.toDateString()}
							</>
						)}
					</p>
				)}
			</div>
			<div className="p-2">
				<p className="font-bold mb-2 text-center">
					{filteredBatches.length ? 'Batches' : 'No batches'} in the month of{' '}
					{`${getDate(date).toLocaleString('default', {
						month: 'long',
					})}-${getDate(date).getFullYear()}`}
				</p>
				{filteredBatches.length ? (
					<select
						defaultValue={JSON.stringify({
							startDate: filteredBatches[0].startDate,
							endDate: filteredBatches[0].endDate,
						})}
						className="select select-bordered w-full max-w-xs"
						onChange={handleBatchChange}
					>
						{filteredBatches.map((filteredBatch, index: number) => (
							<option
								key={index}
								value={JSON.stringify({
									startDate: filteredBatch.startDate,
									endDate: filteredBatch.endDate,
								})}
							>
								{filteredBatch.batchTitle}
							</option>
						))}
					</select>
				) : null}
			</div>
		</div>
	);
};

export default BatchCalender;
