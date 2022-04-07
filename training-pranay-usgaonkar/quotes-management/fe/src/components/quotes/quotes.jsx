import { useEffect, useState } from "react";
import { getQuotes, searchQuotesByAuthor } from "../../apis/service";
import { CardItem } from "../cardItem/cardItem";

export const Quotes = (props) => {
  console.log(props);
  const [quotes, setQuotes] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.searchedAuthor == "" && props.locationData == "") fetchInitial();
    if (props.searchedAuthor == "" && props.locationData !== "")
      getSearchedAuthor(props.locationData);
    if (props.searchedAuthor !== "") getSearchedAuthor(props.searchedAuthor);
  }, [props]);

  const fetchInitial = async () => {
    let response = await getQuotes();
    setQuotes(response);
    setLoading(false);
  };

  const updateQuote = async () => {
    let searchedAuthor = props.locationData;
    if (props.searchedAuthor !== "") searchedAuthor = props.searchedAuthor;

    if (searchedAuthor !== "") getSearchedAuthor(searchedAuthor);
    else fetchInitial();
  };

  const getSearchedAuthor = async (searchedAuthor) => {
    let response = await searchQuotesByAuthor(searchedAuthor);
    setQuotes(response);
    setLoading(false);
  };

  return (
    <div>
      {quotes.map((item) => (
        <CardItem
          loading={loading}
          item={item}
          fetchInitial={fetchInitial}
          updateQuote={updateQuote}
        />
      ))}
    </div>
  );
};
