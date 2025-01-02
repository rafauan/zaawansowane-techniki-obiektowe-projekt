export interface IUser {
  created_at: string;
  id: number;
  email: string;
  email_verified_at: string | null;
  first_name: string;
  last_name: string;
  role: string;
  updated_at: string;
}

export interface SignUpResponse {
  message: string;
  token: string;
  user: IUser;
}

export interface SignInResponse {
  message: string;
  token: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface SearchUsersResponse {
  results: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}
