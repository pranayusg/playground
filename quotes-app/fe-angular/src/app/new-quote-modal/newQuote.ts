export class NewQuote {
  constructor(public quote = '', public author = '', public tags = '') {}
}

export interface Quote {
  id?: string;
  quote: string;
  author: string;
  tags: string;
}

export interface userSignInResponse {
  access_token: string;
  username: string;
}
