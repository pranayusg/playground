import axios, { AxiosResponse } from "axios";

const api = axios.create({
  //   baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: "http://localhost:4000",
});

export const getAuthors = async () => {
  let data;
  try {
    // data = await axios.post(`${process.env.REACT_APP_BASE_URL}/user`, body);
    data = await api.get(`/author`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const getQuotes = async () => {
  let data;
  try {
    data = await api.get(`/quote`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const searchQuotesByAuthor = async (author) => {
  let data;
  try {
    data = await api.get(`/quote/search?author=${author}`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const createQuotes = async (quotesData) => {
  let data;
  try {
    data = await api.post(`/quote`, quotesData);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const editQuote = async (quotesData) => {
  let data;
  let id = quotesData.id;
  delete quotesData.id;
  try {
    data = await api.patch(`/quote/${id}`, quotesData);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const deleteQuote = async (id) => {
  let data;
  try {
    data = await api.delete(`/quote/${id}`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const likeQuote = async (id) => {
  let data;
  try {
    data = await api.patch(`/quote/${id}/like/up`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const dislikeQuote = async (id) => {
  let data;
  try {
    data = await api.patch(`/quote/${id}/dislike/up`);
  } catch (e) {
    return [];
  }
  return data.data;
};
