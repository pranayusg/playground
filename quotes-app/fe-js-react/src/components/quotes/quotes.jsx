import "./quotes.css";
import React, { useState, useEffect } from "react";
import { getQuotes, getQuotesByTag } from "../../apis/openRoutes";
import { CardItem } from "../cardItem/cardItem";
import { auth } from "../../utils/authHelpers";
import {
	getMyfavQuotes,
	getMyUnfavQuotes,
	getMyQuotes,
	searchQuotesByAuthor,
} from "../../apis/protectedRoutes";
import { Pagination } from "antd";

const Quotes = (props) => {
	const noOfCardsOnPage = 5;
	const [data, setData] = useState([]);
	const [likedQuotes, setLikedQuotes] = useState([]);
	const [dislikedQuotes, setDislikedQuotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [myQuotes, setMyQuotes] = useState(false);
	const [minPageValue, setPageMinValue] = useState(0);
	const [maxPageValue, setMaxPageValue] = useState(5);

	useEffect(() => {
		// console.log("quotetype " + props.type);

		if (auth.isLoggedIn()) {
			fetchFavQuotes();
		}

		if (props.type == "All") {
			fetchInitial();
		}
		if (props.type == "Tag") {
			fetchQuotesByTag(props.tagName);
		}
		if (props.type == "Author") {
			fetchQuotesByAuthor(props.searchedAuthor);
		}
		if (props.type == "My Quotes") {
			fetchMyQuotes();
		}
	}, [props]);

	useEffect(() => {
		if (props.type == "Favourite" && likedQuotes.length > 0) {
			showFavQuotes();
		}

		if (props.type == "Disliked" && dislikedQuotes.length > 0) {
			showDislikedQuotes();
		}
	}, [likedQuotes, dislikedQuotes]);

	const showFavQuotes = async () => {
		const quotesData = [];
		likedQuotes.map((likedQuote) => {
			quotesData.push(likedQuote.quote);
		});
		setData(quotesData);
		setLoading(false);
	};

	const showDislikedQuotes = async () => {
		const quotesData = [];
		dislikedQuotes.map((dislikedQuote) => {
			quotesData.push(dislikedQuote.quote);
		});
		setData(quotesData);
		setLoading(false);
	};

	const fetchInitial = async () => {
		const quotesData = await getQuotes();
		setData(quotesData);
		setLoading(false);
	};

	const fetchQuotesByTag = async (tagName) => {
		const quotesData = await getQuotesByTag(tagName);
		setData(quotesData);
		setLoading(false);
	};

	const fetchQuotesByAuthor = async (author) => {
		const quotesData = await searchQuotesByAuthor(author);
		setData(quotesData);
		setLoading(false);
	};

	const fetchMyQuotes = async () => {
		const quotesData = await getMyQuotes();
		setData(quotesData);
		setMyQuotes(true);
		setLoading(false);
	};

	const fetchFavQuotes = async () => {
		const quotesFavData = await getMyfavQuotes();
		const quotesUnFavData = await getMyUnfavQuotes();
		setLikedQuotes(quotesFavData);
		setDislikedQuotes(quotesUnFavData);
	};

	const isLiked = (key) => {
		let likeFlag = false;
		if (likedQuotes.length == 0) return false;
		likedQuotes.map((likedQuote) => {
			if (likedQuote.quote.id == key) {
				likeFlag = true;
			}
		});
		return likeFlag;
	};

	const isDisliked = (key) => {
		let dislikeFlag = false;
		if (dislikedQuotes.length == 0) return false;
		dislikedQuotes.map((dislikedQuote) => {
			if (dislikedQuote.quote.id == key) dislikeFlag = true;
		});
		return dislikeFlag;
	};

	const handlePageChange = (pageno) => {
		console.log(pageno);
		if (pageno <= 1) {
			setPageMinValue(0);
			setMaxPageValue(5);
		} else {
			if (minPageValue == pageno * noOfCardsOnPage) {
				setPageMinValue(minPageValue - noOfCardsOnPage);
				setMaxPageValue(minPageValue);
			} else {
				setPageMinValue(maxPageValue);
				setMaxPageValue(pageno * noOfCardsOnPage);
			}
		}
	};

	return (
		<div className="card-container-parent">
			{data &&
				data.length > 0 &&
				data
					.slice(minPageValue, maxPageValue)
					.map((item) => (
						<CardItem
							key={item.id}
							loading={loading}
							item={item}
							isLiked={isLiked(item.id)}
							isDisliked={isDisliked(item.id)}
							myQuotes={myQuotes}
							fetchMyQuotes={fetchMyQuotes}
						/>
					))}
			{data && data.length > 0 && (
				<div className="pagination-parent">
					<Pagination
						defaultCurrent={1}
						defaultPageSize={noOfCardsOnPage}
						onChange={handlePageChange}
						total={data.length}
					/>
				</div>
			)}
		</div>
	);
};

export default Quotes;
