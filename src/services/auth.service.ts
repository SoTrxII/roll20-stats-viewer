import { injectable } from "inversify";
import { IAuthService, UserInfos } from "@/@types/auth.service";

@injectable()
export class AuthService implements IAuthService {
  private static API_BASE_URL = "https://discord.oauth.pocot.fr";
  //private static API_BASE_URL = "http://localhost:8000";
  private static ENDPOINTS = {
    info: `${AuthService.API_BASE_URL}/me`,
  };

  private userCache: UserInfos | undefined;

  async getUser(): Promise<UserInfos> {
    if (!this.userCache) {
      this.userCache = await (
        await fetch(AuthService.ENDPOINTS.info, { credentials: "include" })
      ).json();
    }

    return this.userCache as UserInfos;
  }

  getRedirectUrl(baseUrl: string): string {
    return `${AuthService.API_BASE_URL}?callback=${baseUrl}`;
  }

  async isLoggedIn(): Promise<boolean> {
    const response = await fetch(AuthService.ENDPOINTS.info, {
      credentials: "include",
    });
    return response.ok && response.status === 200;
  }
}
