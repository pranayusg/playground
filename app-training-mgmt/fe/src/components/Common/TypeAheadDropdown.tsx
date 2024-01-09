import React, { useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TypeAheadDropDownProps {
	items: string[];
	register: UseFormRegisterReturn;
	setValue: (name: string, value: string) => void;
	error?: any;
}

function TypeAheadDropDown({
	items,
	register,
	setValue,
	error,
}: TypeAheadDropDownProps) {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [text, setText] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);

	const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let suggestions: string[] = [];
		const value = e.target.value;
		if (value.length > 0) {
			const regex = new RegExp(`^${value}`, 'i');
			suggestions = items.sort().filter((v) => regex.test(v));
		}

		setSuggestions(suggestions);
		setText(value);
		setOpen(suggestions.length > 0);
	};

	const suggestionSelected = (value: string) => {
		setText(value);
		setSuggestions([]);
		setOpen(false);

		setValue('tech', value); // Set the value of the tech field in the parent form
	};

	useEffect(() => {
		if (text.length === 0) {
			setOpen(false);
		}
	}, [text]);

	return (
		<div className="w-full pt-1 relative w-full text-sm">
			<input
				{...register}
				onChange={onTextChange}
				value={text}
				type="text"
				className={`input input-bordered w-full text-black ${
					error ? 'input-error' : null
				}`}
			/>
			{open && (
				<ul className="text-left pt-1 border border-gray-500 text-black absolute w-full bg-white">
					{suggestions.map((item) => (
						<li
							key={item}
							onClick={() => suggestionSelected(item)}
							className="p-1 text-sm hover:bg-blue-600 hover:text-white"
						>
							{item}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default TypeAheadDropDown;
