import "./cardItem.css";
import { Card, Tooltip } from "antd";
import Moment from "react-moment";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Avatar from "antd/lib/avatar/avatar";
import { auth } from "../../utils/authHelpers";
import {
	deleteQuote,
	dislikeDown,
	dislikeUp,
	likeDown,
	likeUp,
} from "../../apis/protectedRoutes";
import { EditModal } from "../modals/editQuote";
import { helpers } from "../../utils/generalHelpers";
import { EditQuoteDetailed, QuoteDetailed } from "../../interfaces/types";

const swalProps = {
	title: "Are you sure you want to delete this quote ?",
	icon: "info",
	confirmButtonText: "Yes, delete it!",
};

export interface CardItemProps {
	key: string;
	loading: boolean;
	item: QuoteDetailed;
	isLiked: boolean;
	isDisliked: boolean;
	myQuotes: boolean;
	fetchMyQuotes: () => void;
}

const { Meta } = Card;

export const CardItem = (props: CardItemProps) => {
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [editModalData, setEditModalData] = useState<EditQuoteDetailed>({});
	const [isLoggerIn, setIsLoggerIn] = useState<boolean>(auth.isLoggedIn());
	const [isLiked, setIsLiked] = useState(false);
	const [isDisliked, setIsDisliked] = useState(false);
	const [likeCount, setLikeCount] = useState(props.item.likes);
	const [dislikeCount, setDislikeCount] = useState(props.item.dislikes);

	useEffect(() => {
		if (props.isLiked) setIsLiked(true);

		if (props.isDisliked) setIsDisliked(true);
	}, [props]);

	const onClickEdit = (item: QuoteDetailed) => {
		setEditModalData(item);
		setIsEditModalVisible(true);
	};

	const handleEditModalCancel = () => {
		setIsEditModalVisible(false);
		props.fetchMyQuotes();
	};

	const onClickDelete = async (id: string) => {
		let result = await helpers.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) {
			await deleteQuote(id);
			props.fetchMyQuotes();
		}
	};

	const onClickLike = async (id: string) => {
		if (isLiked) {
			await likeDown(id);
			setIsLiked(false);
			setLikeCount(likeCount - 1);
		} else {
			await likeUp(id);
			setIsLiked(true);
			setLikeCount(likeCount + 1);
		}

		if (isDisliked) {
			setIsDisliked(false);
			setDislikeCount(dislikeCount - 1);
		}
	};

	const onClickDislike = async (id: string) => {
		if (isDisliked) {
			await dislikeDown(id);
			setIsDisliked(false);
			setDislikeCount(dislikeCount - 1);
		} else {
			await dislikeUp(id);
			setIsDisliked(true);
			setDislikeCount(dislikeCount + 1);
		}

		if (isLiked) {
			setIsLiked(false);
			setLikeCount(likeCount - 1);
		}
	};

	const getLikeIcon = () => {
		return (
			<>
				{isLiked ? (
					<img
						src={"/like-filled.png"}
						id="image-icons"
						alt="logo"
						onClick={() => onClickLike(props.item.id)}
					/>
				) : (
					<img
						src={"/like-unfilled.jpg"}
						id="image-icons"
						alt="logo"
						onClick={() => onClickLike(props.item.id)}
					/>
				)}
			</>
		);
	};

	const getDislikeIcon = () => {
		return (
			<>
				{isDisliked ? (
					<img
						src={"/like-filled.png"}
						id="image-icons"
						className="dislike-image"
						alt="logo"
						onClick={() => onClickDislike(props.item.id)}
					/>
				) : (
					<img
						src={"/like-unfilled.jpg"}
						id="image-icons"
						className="dislike-image"
						alt="logo"
						onClick={() => onClickDislike(props.item.id)}
					/>
				)}
			</>
		);
	};

	const getActions = () => {
		const actions = [];
		if (isLoggerIn) {
			actions.push(
				<div>
					<div className="like-dislike-value">
						{getLikeIcon()} {likeCount}
					</div>
				</div>,
				<div>
					<div className="like-dislike-value">
						{getDislikeIcon()} {dislikeCount}
					</div>
				</div>
			);

			if (props.myQuotes)
				actions.push(
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
					</div>
				);
		}
		return actions;
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
				bordered={true}
				// style={{
				// 	backgroundColor: "#c59ec0",
				// }}
				// bodyStyle={{
				// 	textAlign: "center",
				// 	// wordWrap: "break-word",
				// 	whiteSpace: "pre-line",
				// }}
				actions={getActions()}
			>
				<div className="card-heading">
					<Avatar src="https://joeschmoe.io/api/v1/random" />
					<div className="info">
						<p className="creator"> {props.item.user.userName}</p>
						<Moment className="moment-date" format="dddd, MMMM Do YYYY">
							{props.item.created_at}
						</Moment>
					</div>
				</div>
				<Meta
					title={'"' + props.item.quote + '"'}
					description={props.item.author}
					style={{ textAlign: "center", whiteSpace: "pre-line" }}
				/>
				<ul className="tag-list">
					{props.item.tags.split(",").map((tag, index) => (
						<li key={index}>{tag}</li>
					))}
				</ul>
			</Card>
		</div>
	);
};
