import { render, screen, fireEvent, act } from '@testing-library/react';
import Form from '../Form';
import userEvent from '@testing-library/user-event';

// setup userEvent
function setup(jsx: JSX.Element) {
	return {
		user: userEvent.setup(),
		...render(jsx),
	};
}

describe('Form test', () => {
	it('Should be able to type into input', async () => {
		const promise = Promise.resolve();
		const mockedOnSubmit = jest.fn(() => promise);

		render(<Form onSubmit={mockedOnSubmit} errorMsg={''} loader={false} />);
		const inputElement: any = screen.getByPlaceholderText(/CCI ID/i);
		fireEvent.change(inputElement, {
			target: { value: 'CCI00376' },
		});

		expect(inputElement.value).toBe('CCI00376');
		await act(() => promise);
	});

	it('Should validate form fields', async () => {
		const mockedOnSubmit = jest.fn();
		const { user } = setup(
			<Form onSubmit={mockedOnSubmit} errorMsg={''} loader={false} />
		);
		await user.type(screen.getByPlaceholderText(/CCI ID/i), 'Some wrong text');
		await user.click(screen.getByRole('button', { name: /Next/i }));

		expect(mockedOnSubmit).not.toHaveBeenCalled();
	});

	it('Should call on submit function when form fields are valid', async () => {
		const mockedOnSubmit = jest.fn();
		const { user } = setup(
			<Form onSubmit={mockedOnSubmit} errorMsg={''} loader={false} />
		);
		await user.type(screen.getByPlaceholderText(/CCI ID/i), 'CCI00376');
		await user.click(screen.getByRole('button', { name: /Next/i }));

		expect(mockedOnSubmit).toHaveBeenCalled();
	});
});
