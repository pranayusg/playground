import axios from "axios";

const usersUrl = "http://localhost:4000";

export const login = async (credentials) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${usersUrl}/auth/login`, credentials)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				resolve();
			});
	});
};

export const logout = async () => {
	localStorage.removeItem("Authorization");
};
