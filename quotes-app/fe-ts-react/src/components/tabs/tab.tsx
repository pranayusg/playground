import { useState } from "react";
import { Tabs } from "antd";
import Quotes from "../quotes/quotes";
import Tags from "../tags/tags";
import { Col, Container, Row } from "react-bootstrap";
import { SearchBox } from "../searchBox/searchBox";
import Authors from "../authors/authors";
import { auth } from "../../utils/authHelpers";

const { TabPane } = Tabs;

const Tab = () => {
	const [showtagTab, setShowtagTab] = useState(false);
	const [tagTabName, setTagTabName] = useState("");
	const [activeKey, setActiveKey] = useState("1");
	const [authorName, setAuthorName] = useState("");

	const displayTagTab = (tabName: string) => {
		setShowtagTab(true);
		setTagTabName(tabName);
		setActiveKey("3");
	};

	const onTabChange = (key: string) => {
		setShowtagTab(false);
		setActiveKey(key);
		setAuthorName("");
	};

	const displayAuthorTab = (author: string) => {
		setAuthorName(author);
		setActiveKey("2");
	};

	return (
		<Container fluid>
			<Row>
				<Col sm={8}>
					<Tabs
						style={{ marginBottom: "60px" }}
						centered
						activeKey={activeKey}
						onChange={onTabChange}
					>
						<TabPane tab="Quotes" key="1">
							<Quotes key={activeKey} type={"All"} />
						</TabPane>
						{auth.isLoggedIn() && (
							<TabPane tab="Author" key="2">
								<SearchBox authorName={authorName} />
							</TabPane>
						)}
						{showtagTab && (
							<TabPane tab={`#${tagTabName}`} key="3">
								<Quotes key={tagTabName} type={"Tag"} tagName={tagTabName} />
							</TabPane>
						)}
					</Tabs>
				</Col>
				<Col sm={4}>
					<Tags displayTagTab={displayTagTab} />
					{auth.isLoggedIn() && <Authors displayAuthorTab={displayAuthorTab} />}
				</Col>
			</Row>
		</Container>
	);
};

export default Tab;
