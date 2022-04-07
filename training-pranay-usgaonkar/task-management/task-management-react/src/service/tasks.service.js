import axios from "axios";

const baseUrl = "http://localhost:4000";

export const getTasks = async () => {
	return await axios.get(`${baseUrl}/tasks`, {
		headers: {
			Authorization: localStorage.getItem("Authorization"),
		},
	});
};

export const getTaskById = async (id) => {
	id = id || "";
	return await axios.get(`${baseUrl}/tasks/${id}`, {
		headers: {
			Authorization: localStorage.getItem("Authorization"),
		},
	});
};

export const addTask = async (task) => {
	await axios
		.post(`${baseUrl}/tasks`, task, {
			headers: {
				Authorization: localStorage.getItem("Authorization"),
			},
		})
		.catch(function (error) {
			if (error.response) {
				// Request made and server responded
				console.log(error.response.data.message);
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

export const editTask = async (id, status) => {
	return await axios
		.patch(
			`${baseUrl}/tasks/${id}`,
			{},
			{
				params: { status },
				headers: {
					Authorization: localStorage.getItem("Authorization"),
				},
			}
		)
		.catch(function (error) {
			if (error.response) {
				// Request made and server responded
				console.log(error.response.data.message);
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

export const deleteTask = async (id) => {
	console.log("hello" + id);
	return await axios.delete(`${baseUrl}/tasks/${id}`, {
		headers: {
			Authorization: localStorage.getItem("Authorization"),
		},
	});
};
