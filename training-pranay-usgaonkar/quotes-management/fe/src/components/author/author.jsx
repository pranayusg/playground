import "./author.css";
import { useEffect, useState } from "react";
import { Quotes } from "../quotes/quotes";
import { Anchor } from "antd";
import { Link, useHistory } from "react-router-dom";
import { getAuthors } from "../../apis/service";
import { List, Avatar } from "antd";

const { Link: AnchorLink } = Anchor;

export const Authors = (props) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    let response = await getAuthors();
    let i = 1;
    response.map((element) => {
      element.id = i;
      i++;
    });
    setAuthors(response);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={authors}
      // loading={true}
      pagination={true}
      size={"large"}
      style={{ margin: 20, textAlign: "center" }}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <Link
                to={"/quotes"}
                key={item.id}
                state={{ author: item.author }}
              >
                {item.author}
              </Link>
            }
          />
        </List.Item>
      )}
    />
  );
};
