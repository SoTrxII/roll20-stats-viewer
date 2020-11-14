import {
  CampaignBasicInfos,
  CampaignGeneralInfos,
  IBackend,
  Session,
} from "@/@types/backend.service";
import cBasicInfo from "./data/mock-campaigns-basic-infos.json";
import cGeneralInfo from "./data/mock-campaigns-general-info.json";
import sInfo from "./data/mock-session.json";
import { injectable } from "inversify";

@injectable()
export class BackendServiceMock implements IBackend {
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
