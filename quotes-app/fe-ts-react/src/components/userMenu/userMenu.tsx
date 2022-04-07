import "./userMenu.css";
import { auth } from "../../utils/authHelpers";

const UserMenu = () => {
	return (
		<a
			style={{ margin: 20, marginLeft: "3%" }}
			type="primary"
			href="/userdetails"
			className="anchor"
		>
			<img
				src={"https://api.realworld.io/images/smiley-cyrus.jpeg"}
				className="user-pic"
				alt="user-pic"
			/>
			{auth.getUsername()}
		</a>
	);
};

export default UserMenu;
