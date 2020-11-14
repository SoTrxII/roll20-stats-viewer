export interface GuildInfos {
  features: string[];
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
}
export interface UserProfile {
  avatar: string | null;
  discriminator: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  public_flags: number;
  username: string;
  verified: boolean;
}
export interface UserInfos {
  guilds: GuildInfos[];
  user: UserProfile;
}
export interface IAuthService {
  isLoggedIn(): Promise<boolean>;
  getUser(): Promise<UserInfos>;
  getRedirectUrl(baseUrl: string): string;
}
