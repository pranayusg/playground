import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import multiMonthPlugin from '@fullcalendar/multimonth';
import { useEffect, useState } from 'react';
import { batchService } from '../../services/batchService';
import { Batch } from '../../interfaces/batchInterface';
import moment from 'moment';
import { useDocumentTitle } from '../../hooks/setDocumentTitle';

const COLORS = ['purple', 'blue', 'orange', 'green'];

const EventModal = ({
	eventBatchId,
	batches,
	calenderBatches,
}: {
	eventBatchId: string;
	batches: Batch[];
	calenderBatches: any[];
}) => {
	const filteredBatch = batches.filter((batch) => batch.id === eventBatchId)[0];
	const filteredBatchColor =
		calenderBatches.filter((batch) => batch.id === eventBatchId)[0]?.color ??
		'';

	return eventBatchId ? (
		<dialog id="my_modal_1" className="modal ">
			<div className="modal-box rounded-none">
				<form method="dialog">
					{/* if there is a button in form, it will close the modal */}
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</button>
				</form>
				<div className="flex gap-2">
					<div
						className="mt-1.5 w-5 h-5"
						style={{
							backgroundColor: filteredBatchColor,
						}}
					></div>
					<h3 className="font-semibold text-xl">{filteredBatch.batchTitle}</h3>
				</div>

				<div className="my-1 font-light">
					{filteredBatch.endDate &&
						filteredBatch.startDate !== filteredBatch.endDate
						? `${moment(new Date(filteredBatch.startDate)).format(
							'Do MMMM YYYY'
						)} - ${moment(new Date(filteredBatch.endDate)).format(
							'Do MMMM YYYY'
						)}`
						: `${moment(new Date(filteredBatch.startDate)).format(
							'Do MMMM YYYY'
						)}`}
				</div>

				<div className="mt-3">
					<div>
						<span className="font-medium">Head Trainer</span> -{' '}
						{filteredBatch.headTrainer}
					</div>
					<div>
						<span className="font-medium">Training Coordinator</span> -{' '}
						{filteredBatch.trainingCoordinator}
					</div>
					<div>
						<span className="font-medium">Tech</span> - {filteredBatch.tech}
					</div>
					<div>
						<span className="font-medium">Status</span> - {filteredBatch.status}
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	) : null;
};

const CustomCalender = () => {
	useDocumentTitle('Batch Calender | Training Management');
	const [batches, setBatches] = useState<Batch[]>([]);
	const [calenderBatches, setCalenderBatches] = useState<any>([]);
	const [eventBatchId, setEventBatchId] = useState('');

	useEffect(() => {
		loadBatches();
	}, []);

	useEffect(() => {
		if (eventBatchId !== '')
			(document as any).getElementById('my_modal_1').showModal();
	}, [eventBatchId]);

	useEffect(() => {
		if (batches.length) {
			const colorLength = COLORS.length;
			let colorIndex = 0;
			setCalenderBatches(
				batches.map((batch) => {
					colorIndex++;

					if (colorIndex === colorLength) colorIndex = 0;

					return {
						id: batch.id,
						className: batch.id,
						title: batch.batchTitle,
						color: COLORS[colorIndex],
						start: new Date(batch.startDate).toISOString().split('T')[0],
						...(batch.endDate !== null && {
							end: new Date(
								new Date(batch.endDate).setDate(
									new Date(batch.endDate).getDate() + 1
								)
							)
								.toISOString()
								.split('T')[0],
						}),
					};
				})
			);
		}
	}, [batches]);

	const loadBatches = async () => {
		const batchData: any = await batchService.getAllBatchesData('normalize', 0);
		setBatches(batchData.records);
	};

	return (
		<div>
			<h1 className="font-bold text-3xl my-8 ml-24">Batch Calender</h1>
			<div className="w-11/12 mx-20 mt-10 card border-solid border-2 p-5 bg-base-200 shadow-xl min-h-[47rem]">
				<FullCalendar
					plugins={[dayGridPlugin, multiMonthPlugin]}
					initialView="dayGridMonth"
					// multiMonthMaxColumns={2}
					height={650}
					contentHeight={600}
					expandRows={true}
					headerToolbar={{
						start: 'today prev,next',
						center: 'title',
						end: 'dayGridMonth,multiMonthYear',
					}}
					buttonText={{ today: 'Today', month: 'Month', year: 'Year' }}
					weekends={false}
					eventMouseEnter={(mouseEnterInfo) => {
						document.body.style.cursor = 'pointer';
						const nodes = (document as any).getElementsByClassName(
							mouseEnterInfo.event._def.publicId
						);
						for (let i = 0; i < nodes.length; i++) {
							nodes[i].style.opacity = 0.7;
						}
					}}
					eventMouseLeave={(mouseEnterInfo) => {
						document.body.style.cursor = '';
						const nodes = (document as any).getElementsByClassName(
							mouseEnterInfo.event._def.publicId
						);
						for (let i = 0; i < nodes.length; i++) {
							nodes[i].style.opacity = 1;
						}
					}}
					eventColor="purple"
					events={calenderBatches}
					eventClick={(info) => {
						setEventBatchId(info.event._def.publicId);
					}}
				/>
				<EventModal
					eventBatchId={eventBatchId}
					batches={batches}
					calenderBatches={calenderBatches}
				/>
			</div>
		</div>
	);
};

export default CustomCalender;
