export const auth = {
	isLoggedIn: () => {
		return sessionStorage.getItem("username") ? true : false;
	},
	clearSession: () => {
		sessionStorage.clear();
	},
	getUsername: () => {
		return sessionStorage.getItem("username");
	},
	setAuthValues: (userData: { access_token: string; username: string }) => {
		sessionStorage.setItem("token", userData.access_token);
		sessionStorage.setItem("username", userData.username);
	},
};
