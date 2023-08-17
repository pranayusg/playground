export interface Quote {
  id?: string;
  quote: string;
  author: string;
  tags: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Register {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  created_at: string;
  email: string;
  id: string;
  password: string;
  userName: string;
}

export interface QuoteDetailed {
  id: string;
  created_at: string;
  quote: string;
  author: string;
  tags: string;
  likes: number;
  dislikes: number;
  user: User;
}

export interface FavQuote {
  id: string;
  like: boolean;
  dislike: boolean;
  created_at: string;
  quote: QuoteDetailed;
}

export interface EditQuoteDetailed {
  id?: string;
  created_at?: string;
  quote?: string;
  author?: string;
  tags?: string;
  likes?: number;
  dislikes?: number;
  user?: User;
}

export interface Author {
  author: string;
}
