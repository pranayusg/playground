import React from "react";
import { HomeOutlined } from "@ant-design/icons";

const HomePage = () => {
	return (
		<a
			style={{ margin: 20, marginLeft: "3%" }}
			type="primary"
			href="/"
			className="anchor"
		>
			<HomeOutlined />
			Home
		</a>
	);
};

export default HomePage;
