import axios from "axios";

const baseUrl = "http://localhost:4000";

export const getUsers = async () => {
	return await axios.get(`${baseUrl}/users`);
};

export const getUserById = async (id) => {
	id = id || "";
	return await axios.get(`${baseUrl}/users/${id}`);
};

export const addUser = async (user) => {
	return await axios.post(`${baseUrl}/users`, user).catch(function (error) {
		if (error.response) {
			// Request made and server responded
			// console.log(error.response.data.message);
			return error.response.data.message;
			// console.log(error.response.status);
			// console.log(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log("Error", error.message);
		}
	});
};

export const editUser = async (userId, user) => {
	const { id, password, isAdmin, ...userData } = user;
	return await axios.patch(`${baseUrl}/users/${userId}`, userData);
};

export const deleteUser = async (id) => {
	return await axios.delete(`${baseUrl}/users/${id}`);
};

export const addTaskByUserId = async (userId, task) => {
	userId = userId || "";
	return await axios.post(`${baseUrl}/users/${userId}/task`, task);
};

export const getTasksByUserId = async (userId) => {
	userId = userId || "";
	return await axios.get(`${baseUrl}/users/${userId}/task`);
};
