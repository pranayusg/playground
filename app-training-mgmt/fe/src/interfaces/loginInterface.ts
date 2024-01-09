export interface LoginResponse {
	message?: string;
	access_token?: string;
	statusCode?: number;
}

export interface SetPasswordResponse {
	message?: string;
}

export interface LoginPayload {
	username: string;
	password?: string;
}

export interface SetPasswordPayload {
	password: string;
}
