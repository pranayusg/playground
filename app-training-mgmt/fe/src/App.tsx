import './App.css';
import { Routes, Route } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="*" element={<PageNotFound />} />.
			</Routes>
		</div>
	);
}

export default App;
