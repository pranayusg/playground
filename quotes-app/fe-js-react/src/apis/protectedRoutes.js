import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const api = axios.create({
	//   baseURL: process.env.REACT_APP_BASE_URL,
	baseURL: "http://localhost:4000",
});

//-------------------- Interceptions ------------------------//

api.interceptors.request.use(
	(req) => {
		const userToken = sessionStorage.getItem("token");
		req.headers.Authorization = `Bearer ${userToken}`;
		return Promise.resolve(req);
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const createQuotes = async (quotesData) => {
	let data;
	try {
		data = await api.post(`/quote`, quotesData);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const getAuthors = async () => {
	let data;
	try {
		data = await api.get(`/author`);
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

export const getMyfavQuotes = async () => {
	let data;
	try {
		data = await api.get(`/quote/myfavquotes`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const getMyUnfavQuotes = async () => {
	let data;
	try {
		data = await api.get(`/quote/myunfavquotes`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const likeUp = async (id) => {
	let data;
	try {
		data = await api.patch(`/quote/${id}/like/up`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const dislikeUp = async (id) => {
	let data;
	try {
		data = await api.patch(`/quote/${id}/dislike/up`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const likeDown = async (id) => {
	let data;
	try {
		data = await api.patch(`/quote/${id}/like/down`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const dislikeDown = async (id) => {
	let data;
	try {
		data = await api.patch(`/quote/${id}/dislike/down`);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const getMyQuotes = async () => {
	let data;
	try {
		data = await api.get(`/quote/myquotes`);
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

export const updateUser = async (values) => {
	console.log(values);
	let data;
	try {
		data = await api.patch(`/users`, values);
	} catch (e) {
		return [];
	}
	return data.data;
};

export const getUserDetails = async () => {
	let data;
	try {
		data = await api.get(`/users`);
	} catch (e) {
		return [];
	}
	return data.data;
};
