import { LogoutOutlined } from "@ant-design/icons";

interface LogOutProps {
	setLogOut: () => void;
}
const LogOut = (props: LogOutProps) => {
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
