import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Should render same text passed into title prop using different queries', () => {
	it('Using getByText', () => {
		render(<Header title="todo" />);
		const h1Element = screen.getByText(/todo/i);
		expect(h1Element).toBeInTheDocument();
	});

	it('Using getByRole', () => {
		render(<Header title="todo" />);
		const h1Element = screen.getByRole('heading');
		expect(h1Element).toBeInTheDocument();
	});

	it('Using getByRole when there are multiple roles', () => {
		render(<Header title="todo" />);
		const h1Element = screen.getByRole('heading', { name: /todo/i });
		expect(h1Element).toBeInTheDocument();
	});

	it('Using getByTitle', () => {
		render(<Header title="todo" />);
		const h1Element = screen.getByTitle('Header');
		expect(h1Element).toBeInTheDocument();
	});

	it('Using findByText', async () => {
		render(<Header title="todo" />);
		const h1Element = await screen.findByText(/todo/i);
		expect(h1Element).toBeInTheDocument();
	});

	it('Using queryByText', () => {
		render(<Header title="todo" />);
		const h1Element = screen.queryByText(/todo/i);
		expect(h1Element).toBeInTheDocument();
	});

	it('Using getAllByText', () => {
		render(<Header title="todo" />);
		const h1Elements = screen.getAllByText(/todo/i);
		expect(h1Elements.length).toBe(1);
	});
});

describe('Assertions demo', () => {
	it('Check whether the component contanins h1 tag', () => {
		render(<Header title="todo" />);
		const h1Elements = screen.getByText(/todo/i);
		expect(h1Elements).toContainHTML('h1');
	});

	it('Check text content', () => {
		render(<Header title="todo" />);
		const h1Element = screen.getByRole('heading');
		expect(h1Element).toHaveTextContent('todo');
	});

	it('Using not', () => {
		render(<Header title="todo" />);
		const h1Element = screen.queryByText(/todos/i);
		expect(h1Element).not.toBeInTheDocument();
	});
});
