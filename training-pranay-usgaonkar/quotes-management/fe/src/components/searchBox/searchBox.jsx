import "./searchbox.css";
import { useEffect, useState } from "react";
import { AutoComplete, Typography, Space } from "antd";
import { getAuthors } from "../../apis/service";
import { Quotes } from "../quotes/quotes";
import { useLocation } from "react-router-dom";
import { AddModal } from "../modals/addModal";

const { Text } = Typography;

const filterAuthors = (searchText, authors) => {
  let optionData = [];
  authors.map((element) => {
    if (
      element.author.toLowerCase().includes(searchText) ||
      element.author.toUpperCase().includes(searchText)
    )
      optionData.push({ value: element.author });
  });

  return optionData;
};

export const SearchBox = () => {
  let location = useLocation();

  let locationDataValue = location.state ? location.state.author : "";
  const [authors, setAuthors] = useState([]);

  const [options, setOptions] = useState([]);
  const [searchedAuthor, setSearchedAuthor] = useState("");
  const [locationData, setLocationData] = useState(locationDataValue);
  const [addQuoteFlag, setAddQuoteFlag] = useState(0);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    let response = await getAuthors();
    setAuthors(response);
  };

  const test = () => {
    if (addQuoteFlag == 0) setAddQuoteFlag(1);
    if (addQuoteFlag == 1) setAddQuoteFlag(0);
    console.log("testing");
  };

  const onSearch = (searchText) => {
    setOptions(!searchText ? [] : filterAuthors(searchText, authors));
  };

  const onSelect = (data) => {
    setSearchedAuthor(data);
  };

  const onChange = (data) => {
    if (data == "") {
      setLocationData("");
      setSearchedAuthor(data);
    }
    if (data == undefined) {
      setLocationData("");
      setSearchedAuthor("");
    }
  };

  return (
    <div>
      <AddModal test={test} />
      <div className="center">
        <Text
          strong
          style={{
            fontSize: "15px",
            paddingRight: "1%",
          }}
        >
          Search by author{" "}
        </Text>
        <AutoComplete
          defaultValue={locationData}
          allowClear
          options={options}
          style={{
            width: 250,
          }}
          onSelect={onSelect}
          onChange={onChange}
          onSearch={onSearch}
          placeholder="Author name"
        />
      </div>
      <Quotes
        searchedAuthor={searchedAuthor}
        locationData={locationData}
        addQuoteFlag={addQuoteFlag}
      />
    </div>
  );
};
