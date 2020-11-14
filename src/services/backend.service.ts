import {
  CampaignBasicInfos,
  CampaignGeneralInfos,
  IBackend,
  Session,
} from "@/@types/backend.service";
import { injectable } from "inversify";

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

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getCampaignList(): Promise<CampaignBasicInfos[]> {
    return (await fetch(this.endpoints(this.baseUrl).list)).json();
  }

  async getDetailsOfCampaign(
    id: string
  ): Promise<CampaignGeneralInfos | undefined> {
    const details = (
      await fetch(this.endpoints(this.baseUrl).genInfos(id))
    ).json();
    return details;
  }

  async getDetailsOfSession(
    campaignId: string,
    sessionId: string
  ): Promise<Session | undefined> {
    return (
      await fetch(this.endpoints(this.baseUrl).session(campaignId, sessionId))
    ).json();
  }
}
