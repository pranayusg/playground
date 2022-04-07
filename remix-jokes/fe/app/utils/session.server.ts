import { createCookieSessionStorage, redirect } from "remix";
import { LoginResponse } from "../utils/types";

const sessionSecret = "SESSION_SECRET";
if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
	cookie: {
		name: "RJ_session",
		// normally you want this to be `secure: true`
		// but that doesn't work on localhost for Safari
		// https://web.dev/when-to-use-local-https/
		//   secure: process.env.NODE_ENV === "production",
		secrets: [sessionSecret],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

function getUserSession(request: Request) {
	return storage.getSession(request.headers.get("Cookie"));
}

export async function getToken(request: Request) {
	const session = await getUserSession(request);
	console.log(session.data.user.access_token);
	const APIToken = session.data.user.access_token;
	if (typeof APIToken !== "string") throw logout(request);

	return `Bearer ${APIToken}`;
}

export async function getUsername(request: Request) {
	const session = await getUserSession(request);
	const username = session.data.user.username;
	if (typeof username !== "string") throw logout(request);

	return username;
}

export async function logout(request: Request) {
	const session = await getUserSession(request);
	return redirect("/login", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

export async function createUserSession(
	loginResponse: LoginResponse,
	redirectTo: string
) {
	const session = await storage.getSession();
	session.set("user", loginResponse);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
}
