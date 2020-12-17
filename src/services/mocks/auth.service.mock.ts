import { injectable } from "inversify";
import { IAuthService, UserInfos } from "@/@types/auth.service";

@injectable()
export class AuthServiceMock implements IAuthService {
  get credentials(): UserInfos {
    return {} as UserInfos;
  }

  isLoggedIn(): boolean {
    return true;
  }
}
