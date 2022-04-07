export type Joke = {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	content: string;
};

export type LoginResponse = {
	access_token?: string;
	username?: string;
	error?: string;
};
