import { IAuthService, UserInfos } from "@/@types/auth.service";
import { injectable } from "inversify";
import * as userInfo from "./data/mock-campaigns-basic-infos.json";

@injectable()
export class AuthServiceMock implements IAuthService {
  getRedirectUrl(baseUrl: string): string {
    return "";
  }

  getUser(): Promise<UserInfos> {
    //"default" is only an artefact from the required JSON
    // @ts-ignore
    return Promise.resolve(userInfo.default);
  }

  isLoggedIn(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
