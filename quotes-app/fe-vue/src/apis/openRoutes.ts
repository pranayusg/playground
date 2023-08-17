import axios from "axios";
import { Credentials, Register } from "../interfaces/types";

const api = axios.create({
  //   baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: "http://localhost:4000",
});

export const getQuotes = async () => {
  let data;
  try {
    data = await api.get(`/quote`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const getAllTags = async () => {
  let data;
  try {
    data = await api.get(`/quote/alltags`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const getQuotesByTag = async (tag: string) => {
  let data;
  try {
    data = await api.get(`/quote/search/searchtag/tag?tag=${tag}`);
  } catch (e) {
    return [];
  }
  return data.data;
};

export const login = async (credentials: Credentials) => {
  let data;
  try {
    data = await api.post(`/auth`, credentials);
  } catch (e) {
    return {};
  }
  return data.data;
};

export const register = async (registrationDetails: Register) => {
  let data;
  try {
    data = await api.post(`/users`, registrationDetails);
  } catch (e) {
    return [];
  }
  return data.data;
};
