import React, { useState } from "react";
import { useContext } from "react";
import { QuotesContext } from "../../App";

import PageHeading from "../pageHeading/pageHeading";
import Tab from "../tabs/tab";

const Home = () => {
	const context = useContext(QuotesContext);
	return (
		<div>
			<PageHeading />
			<Tab key={context.isLoggedIn + context.reloadTabs} />
		</div>
	);
};

export default Home;
