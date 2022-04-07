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
	setAuthValues: (userData) => {
		sessionStorage.setItem("token", userData.access_token);
		sessionStorage.setItem("username", userData.username);
	},

	// getAuth: () => {
	// 	let token = helpers.getsessionStorage("token");
	// 	let userToken = helpers.getsessionStorage("userToken");
	// 	return token && userToken;
	// },
	// getAdminAuth: () => {
	// 	let token = helpers.getsessionStorage("token");
	// 	let userToken = helpers.getsessionStorage("userToken");
	// 	let isAdmin = helpers.getsessionStorage("isAdmin");
	// 	return token && userToken && JSON.parse(isAdmin ? isAdmin : "false");
	// },
};
