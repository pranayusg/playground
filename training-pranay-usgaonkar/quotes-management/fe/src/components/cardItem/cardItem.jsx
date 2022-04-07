import "./cardItem.css";
import { deleteQuote, dislikeQuote, likeQuote } from "../../apis/service";
import { Card, Tooltip } from "antd";
import {
  EditTwoTone,
  LikeTwoTone,
  DislikeTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { EditModal } from "../modals/editModal";
import { useState } from "react";

const { Meta } = Card;

export const CardItem = (props) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editModalData, setEditModalData] = useState({});

  const onClickEdit = (item) => {
    setEditModalData(item);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    props.updateQuote();
  };

  const onClickDelete = async (id) => {
    await deleteQuote(id);
    props.fetchInitial();
  };

  const onClickLike = async (id) => {
    await likeQuote(id);
    props.updateQuote();
  };

  const onClickDislike = async (id) => {
    await dislikeQuote(id);
    props.updateQuote();
  };

  return (
    <div className="card-container">
      {isEditModalVisible && (
        <EditModal
          isEditModalVisible={isEditModalVisible}
          handleEditModalCancel={handleEditModalCancel}
          data={editModalData}
        />
      )}
      <Card
        key={props.item.id}
        loading={props.loading}
        hoverable={true}
        style={{
          backgroundColor: "#c59ec0",
        }}
        bodyStyle={{
          textAlign: "center",
          // wordWrap: "break-word",
          whiteSpace: "pre-line",
        }}
        actions={[
          <div>
            <Tooltip title="Like">
              <LikeTwoTone
                className="icons"
                onClick={() => onClickLike(props.item.id)}
              />
            </Tooltip>
            <div className="like-dislike-value">{props.item.likes}</div>
          </div>,
          <div>
            <Tooltip title="Dislike">
              <DislikeTwoTone
                className="icons"
                onClick={() => onClickDislike(props.item.id)}
              />
            </Tooltip>
            <div className="like-dislike-value">{props.item.dislikes}</div>
          </div>,
          <div>
            <Tooltip title="Edit">
              <EditTwoTone
                className="icons"
                twoToneColor="#413939"
                key="edit"
                onClick={() => onClickEdit(props.item)}
              />
            </Tooltip>
          </div>,
          <div>
            <Tooltip title="Delete">
              <DeleteTwoTone
                className="icons"
                twoToneColor="#eb2f96"
                onClick={() => onClickDelete(props.item.id)}
              />
            </Tooltip>
          </div>,
        ]}
      >
        <Meta
          title={'"' + props.item.quote + '"'}
          description={props.item.author}
        />
      </Card>
    </div>
  );
};
