import {
  CampaignBasicInfos,
  CampaignGeneralInfos,
  IBackend,
  Session,
} from "@/@types/backend.service";
import { inject, injectable } from "inversify";
import { IAuthService } from "@/@types/auth.service";
import { TYPES } from "@/types";

class BackendError extends Error {}

@injectable()
export class BackendService implements IBackend {
  private readonly baseUrl: string;
  private readonly endpoints = (baseUrl: string) => {
    return {
      list: `${baseUrl}/campaign/list`,
      genInfos: (id: string) => `${baseUrl}/campaign/${id}`,
      session: (id: string, sid: string) =>
        `${baseUrl}/campaign/${id}/session/${sid}`,
    };
  };

  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  private getHeaders() {
    const h = new Headers();
    Object.entries(this.authService.credentials).forEach(([k, v]) => {
      h.append(k, v);
    });
    return h;
  }

  async getCampaignList(): Promise<CampaignBasicInfos[]> {
    return (
      await fetch(this.endpoints(this.baseUrl).list, {
        headers: this.getHeaders(),
      })
    ).json();
  }

  async getDetailsOfCampaign(
    id: string
  ): Promise<CampaignGeneralInfos | undefined> {
    return (
      await fetch(this.endpoints(this.baseUrl).genInfos(id), {
        headers: this.getHeaders(),
      })
    ).json();
  }

  async getDetailsOfSession(
    campaignId: string,
    sessionId: string
  ): Promise<Session | undefined> {
    return (
      await fetch(this.endpoints(this.baseUrl).session(campaignId, sessionId), {
        headers: this.getHeaders(),
      })
    ).json();
  }
}
