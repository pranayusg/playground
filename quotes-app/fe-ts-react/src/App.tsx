import "./App.css";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Home from "./components/home/home";
import UserDetails from "./components/userDetails/userDetails";
import { auth } from "./utils/authHelpers";

interface ContextProps {
	isLoggedIn: boolean;
	updateTabs: () => void;
	logIn: () => void;
	logOut: () => void;
	reloadTabs: boolean;
}

export const QuotesContext = React.createContext({} as ContextProps);

function App() {
	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(auth.isLoggedIn());
	const [reloadTabs, setReloadTabs] = useState<boolean>(false);

	const logOut = () => {
		auth.clearSession();
		setIsLoggedIn(false);
		navigate("/");
	};

	const logIn = () => {
		setIsLoggedIn(true);
	};

	const updateTabs = () => {
		setReloadTabs(true);
		setReloadTabs(false);
	};

	const propsObj: ContextProps = {
		isLoggedIn: isLoggedIn,
		updateTabs: updateTabs,
		logIn: logIn,
		logOut: logOut,
		reloadTabs: reloadTabs,
	};
	return (
		<div className="App">
			<QuotesContext.Provider value={propsObj}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="userdetails" element={<UserDetails />} />
				</Routes>
			</QuotesContext.Provider>
		</div>
	);
}

export default App;
