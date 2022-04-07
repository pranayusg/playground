import "./userHeading.css";
import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { auth } from "../../utils/authHelpers";
import HomePage from "../homePage/homePage";
import UserSettings from "../userSettings/userSettings";
import { QuotesContext } from "../../App";
import LogOut from "../logOut/logOut";

const UserHeading = () => {
	const contextValue = useContext(QuotesContext);
	return (
		<>
			<Container>
				<Row className="m-2">
					<Col sm={8}>
						<h5 className="logo">QuotesApp</h5>
					</Col>
					<Col>
						<HomePage />
						<UserSettings />
						<LogOut setLogOut={contextValue.logOut} />
					</Col>
				</Row>
			</Container>
			<Container fluid>
				<div className="user-jumbotron">
					<div className="user-content">
						<img
							src={"https://api.realworld.io/images/smiley-cyrus.jpeg"}
							className="user-img"
							alt="user-img"
						/>

						<h5 className="user-jumbotron-content">{auth.getUsername()}</h5>
					</div>
				</div>
			</Container>
		</>
	);
};

export default UserHeading;
