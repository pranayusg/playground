import "./pageHeading.css";
import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import SignUp from "../modals/signUp";
import SignIn from "../modals/signIn";
import LogOut from "../logOut/logOut";
import { NewQuote } from "../modals/newQuotes";
import UserMenu from "../userMenu/userMenu";
import { QuotesContext } from "../../App";

const pageHeadingBeforeLogin = (setLogIn: () => void) => {
	return (
		<>
			<Container>
				<Row className="m-2">
					<Col sm={8}>
						<h5 className="logo">QuotesApp</h5>
					</Col>
					<Col>
						<SignUp />
						<SignIn setLogIn={setLogIn} />
					</Col>
				</Row>
			</Container>
			<Container fluid>
				<div className="jumbotron">
					<div className="content">
						<h2 className="jumbotron-heading">QuotesApp</h2>
						<p className="jumbotron-content">
							A place to share your favourite quotes.
						</p>
					</div>
				</div>
			</Container>
		</>
	);
};

const pageHeadingAfterLogin = () => {
	return (
		<Container>
			<Row className="m-2">
				<Col sm={8}>
					<h5 className="logo">QuotesApp</h5>
				</Col>
				<Col>
					<NewQuote />
					<UserMenu />
				</Col>
			</Row>
		</Container>
	);
};

const PageHeading = () => {
	const contextValue = useContext(QuotesContext);

	return (
		<>
			{contextValue.isLoggedIn
				? pageHeadingAfterLogin()
				: pageHeadingBeforeLogin(contextValue.logIn)}
		</>
	);
};

export default PageHeading;
