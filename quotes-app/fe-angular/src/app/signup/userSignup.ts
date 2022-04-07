export class UserSignUp {
  constructor(
    public userName = '',
    public email = '',
    public password = '',
    public confirmPassword = ''
  ) {}
}

// export interface userSignUpBody {
//   userName: string;
//   email: string;
//   passwords: { password: string; confirmPassword: string };
// }

export interface userSignUpBody {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface userSignUpResponse {
  userName: string;
  email: string;
  id: string;
  created_at: Date;
}
