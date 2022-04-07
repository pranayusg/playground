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
import { FavQuote, QuoteDetailed } from "../../interfaces/types";

interface QuotesProps {
	type: string;
	tagName?: string;
	searchedAuthor?: string;
}

const Quotes = (props: QuotesProps) => {
	const noOfCardsOnPage = 5;
	const [data, setData] = useState<QuoteDetailed[]>([]);
	const [likedQuotes, setLikedQuotes] = useState<FavQuote[]>([]);
	const [dislikedQuotes, setDislikedQuotes] = useState<FavQuote[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [myQuotes, setMyQuotes] = useState<boolean>(false);
	const [minPageValue, setPageMinValue] = useState(0);
	const [maxPageValue, setMaxPageValue] = useState(5);

	useEffect(() => {
		// console.log("quotetype " + props.type);

		if (auth.isLoggedIn()) {
			fetchFavQuotes();
		}

		if (props.type === "All") {
			fetchInitial();
		}
		if (props.type === "Tag" && props.tagName) {
			fetchQuotesByTag(props.tagName);
		}
		if (props.type === "Author" && props.searchedAuthor) {
			fetchQuotesByAuthor(props.searchedAuthor);
		}
		if (props.type === "My Quotes") {
			fetchMyQuotes();
		}
	}, [props]);

	useEffect(() => {
		if (props.type === "Favourite" && likedQuotes.length > 0) {
			showFavQuotes();
		}

		if (props.type === "Disliked" && dislikedQuotes.length > 0) {
			showDislikedQuotes();
		}
	}, [likedQuotes, dislikedQuotes]);

	const showFavQuotes = async () => {
		const quotesData: QuoteDetailed[] = [];
		likedQuotes.forEach((likedQuote: FavQuote) => {
			quotesData.push(likedQuote.quote);
		});
		setData(quotesData);
		setLoading(false);
	};

	const showDislikedQuotes = async () => {
		const quotesData: QuoteDetailed[] = [];
		dislikedQuotes.forEach((dislikedQuote: FavQuote) => {
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

	const fetchQuotesByTag = async (tagName: string) => {
		const quotesData = await getQuotesByTag(tagName);
		setData(quotesData);
		setLoading(false);
	};

	const fetchQuotesByAuthor = async (author: string) => {
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

	const isLiked = (key: string) => {
		let likeFlag = false;
		if (likedQuotes.length === 0) return false;
		likedQuotes.forEach((likedQuote: FavQuote) => {
			if (likedQuote.quote.id === key) {
				likeFlag = true;
			}
		});
		return likeFlag;
	};

	const isDisliked = (key: string) => {
		let dislikeFlag = false;
		if (dislikedQuotes.length === 0) return false;
		dislikedQuotes.forEach((dislikedQuote: FavQuote) => {
			if (dislikedQuote.quote.id === key) dislikeFlag = true;
		});
		return dislikeFlag;
	};

	const handlePageChange = (pageno: number) => {
		if (pageno <= 1) {
			setPageMinValue(0);
			setMaxPageValue(5);
		} else {
			if (minPageValue === pageno * noOfCardsOnPage) {
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
