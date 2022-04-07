import "./home.css";
import { useState } from "react";
import { Tabs } from "antd";
import { Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import { Header } from "antd/lib/layout/layout";

const { TabPane } = Tabs;

export const Home = () => {
  const [current, setCurrent] = useState("1");

  const handleClick = (e) => {
    setCurrent({ current: e.key });
  };

  return (
    <>
      <Header>
        <h2 style={{ color: "white" }}>QuotesApp</h2>
        <Menu
          theme="dark"
          onClick={handleClick}
          selectedKeys={current}
          mode="horizontal"
        >
          <Menu.Item key="2">
            <Link to={"/"}>Authors</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={"/quotes"}>Quotes</Link>
          </Menu.Item>
        </Menu>
      </Header>
    </>
  );
};
