import React from "react";
import { LogoutOutlined } from "@ant-design/icons";

const LogOut = (props) => {
	const logOutUser = () => {
		props.setLogOut();
	};

	return (
		<a
			style={{ margin: 20, marginLeft: "3%" }}
			type="primary"
			onClick={logOutUser}
		>
			<LogoutOutlined />
			Log out
		</a>
	);
};

export default LogOut;
