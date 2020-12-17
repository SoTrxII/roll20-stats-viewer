import { injectable } from "inversify";
import { IAuthService, UserInfos } from "@/@types/auth.service";

@injectable()
export class AuthService implements IAuthService {
  private userCache: Partial<UserInfos> = {};

  get credentials(): UserInfos | {} {
    return this.userCache as UserInfos;
  }

  set credentials(c: UserInfos | {}) {
    this.userCache = c;
  }

  isLoggedIn(): boolean {
    return (
      this.userCache.email !== undefined &&
      this.userCache.password !== undefined
    );
  }
}
