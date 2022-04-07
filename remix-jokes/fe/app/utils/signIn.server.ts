import { LoginResponse } from "../utils/types";

type LoginForm = {
	username: string;
	password: string;
};

export async function processLogin({
	username,
	password,
}: LoginForm): Promise<LoginResponse> {
	const response = await fetch(`http://localhost:4000/login`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	});
	if (response.status >= 200 && response.status <= 299) {
		const LoginResponse: LoginResponse = await response.json();
		return LoginResponse;
	} else {
		return {
			error: `Either the email '${username}' or the password could not be found.`,
		};
	}
}

export async function register({
	username,
	password,
}: LoginForm): Promise<LoginResponse> {
	const response = await fetch(`http://localhost:4000/register`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	});
	if (response.status >= 200 && response.status <= 299) {
		const LoginResponse: LoginResponse = await response.json();
		return LoginResponse;
	} else {
		return {
			error: `Something went wrong trying to create a new user.`,
		};
	}
}
