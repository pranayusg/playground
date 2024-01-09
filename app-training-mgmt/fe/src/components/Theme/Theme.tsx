import { THEMES } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '../../store/features/globalSlice';

const Theme = () => {
	const dispatch = useDispatch();
	const theme = useSelector(selectTheme);

	const onThemeSelected = (selectedTheme: string) => {
		localStorage.setItem('themeChanged', 'true');
		if (selectedTheme === 'default') dispatch(setTheme(''));
		dispatch(setTheme(selectedTheme));
	};

	return (
		<div>
			<div className="dropdown dropdown-bottom mr-4 py-1">
				<select
					className="select select-bordered"
					onChange={(e: any) => onThemeSelected(e.target.value)}
					name="noOfRecords"
					defaultValue={theme}
					key={theme}
				>
					{THEMES.map((item: string, index: number) => (
						<option key={index} value={item}>
							{item}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default Theme;
