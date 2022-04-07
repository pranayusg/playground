export class UserSignIn {
  constructor(public email = '', public password = '') {}
}

export interface userSignInBody {
  username: string;
  password: string;
}

export interface userSignInResponse {
  access_token: string;
  username: string;
}
