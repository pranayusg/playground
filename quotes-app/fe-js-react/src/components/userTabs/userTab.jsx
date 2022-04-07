import React, { useState } from "react";
import { Tabs } from "antd";
import Quotes from "../quotes/quotes";
import { Col, Container, Row } from "react-bootstrap";

const { TabPane } = Tabs;

const UserTab = () => {
	const [activeKey, setActiveKey] = useState("1");

	const onTabChange = (key) => {
		setActiveKey(key);
	};

	return (
		<Container fluid>
			<Row>
				<Col>
					<Tabs centered activeKey={activeKey} onChange={onTabChange}>
						<TabPane tab="My Quotes" key="1">
							<Quotes key={activeKey} type={"My Quotes"} />
						</TabPane>
						<TabPane tab="Favourite Quotes" key="2">
							<Quotes key={activeKey} type={"Favourite"} />
						</TabPane>
						<TabPane tab="Disliked Quotes" key="3">
							<Quotes key={activeKey} type={"Disliked"} />
						</TabPane>
					</Tabs>
				</Col>
			</Row>
		</Container>
	);
};

export default UserTab;
