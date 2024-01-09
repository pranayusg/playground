import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stats from '../Stats';

// setup userEvent
function setup(jsx: JSX.Element) {
	return {
		user: userEvent.setup(),
		...render(jsx),
	};
}

describe('Stats test', () => {
	it('Should show title in the document passed as props', () => {
		render(
			<Stats
				title="Completed Batches"
				value="48"
				list={['AWS : Introduction to Serveless', 'AWS : AWS Phase 2']}
			/>
		);
		const title = screen.getByText('Completed Batches');
		expect(title).toBeInTheDocument();
	});

	it('Should change list classname when mouse is hovered', async () => {
		const { user } = setup(
			<Stats
				title="Completed Batches"
				value="48"
				list={['AWS : Introduction to Serveless', 'AWS : AWS Phase 2']}
			/>
		);

		await user.hover(screen.getByTitle('container'));
		const list = screen.getAllByRole('list');
		expect(list[0].className).not.toContain('hidden');
	});

	it('List items should have proper inner html', () => {
		render(
			<Stats
				title="Completed Batches"
				value="48"
				list={['AWS : Introduction to Serveless', 'AWS : AWS Phase 2']}
			/>
		);
		const listitem = screen.getAllByRole('listitem');
		expect(listitem[0].innerHTML).toBe('AWS : Introduction to Serveless');
		expect(listitem[1].innerHTML).toBe('<hr>AWS : AWS Phase 2');
	});

	it('List items should have proper classname', () => {
		render(
			<Stats
				title="Completed Batches"
				value="48"
				list={['AWS : Introduction to Serveless', 'AWS : AWS Phase 2']}
			/>
		);
		const listitem = screen.getAllByRole('listitem');
		expect(listitem[0].className).toBe('py-1 px-2 hover:bg-slate-200');
	});
});
