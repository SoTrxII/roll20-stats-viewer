export interface UserInfos {
  email: string;
  password: string;
}
export interface IAuthService {
  isLoggedIn(): boolean;
  credentials: UserInfos | {};
}
