import {
  CampaignBasicInfos,
  CampaignGeneralInfos,
  IBackend,
  Session,
} from "@/@types/backend.service";
import cBasicInfo from "./data/mock-campaigns-basic-infos.json";
import cGeneralInfo from "./data/mock-campaigns-general-info.json";
import sInfo from "./data/mock-session.json";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { IAuthService } from "@/@types/auth.service";

@injectable()
export class BackendServiceMock implements IBackend {
  constructor(private authService: IAuthService, baseUrl: string) {}
  getCampaignList(): Promise<CampaignBasicInfos[]> {
    return Promise.resolve(cBasicInfo);
  }
  getDetailsOfCampaign(id: string): Promise<CampaignGeneralInfos | undefined> {
    return Promise.resolve(cGeneralInfo.find((c) => c.id === id));
  }
  getDetailsOfSession(campaignId: string, sessionId: string): Promise<Session> {
    //@ts-ignore
    return Promise.resolve(sInfo);
  }
}
