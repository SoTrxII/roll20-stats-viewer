export interface CampaignBasicInfos {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CampaignGeneralInfos {
  id: string;
  playTimeMs: number;
  players: Player[];
  dicesRolledCount: number;
  sessions: Partial<Session>[];
}

export interface Player {
  avatarUrl: string;
  isGm: boolean;
  roll20Id: string;
  username: string;
}

export interface Session {
  start: number;
  end: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  ".priority": number;
  avatar: string;
  content: any;
  playerid: string;
  type: string;
  who: string;
}

/**
 * Text messages
 */
export interface GeneralChatMessage extends ChatMessage {
  type: "general";
  content: string;
}

/**
 * Rolls with a template
 */
export interface TemplateRollChatMessage extends ChatMessage {
  type: "general";
  content: string;
  inlinerolls: InlineRoll[];
  rolltemplate?: string;
}
export interface InlineRoll {
  expression: string;
  results: RollChatMessageContent;
  rollid: string;
  signature: string;
}

export interface PlainRollChatMessage extends ChatMessage {
  type: "rollresult";
  content: RollChatMessageContent;
  origRoll: string;
}
export interface RollChatMessageContent {
  type: "V";
  rolls: [DiceResult];
  resultType: string;
  total: string;
}

export interface DiceResult {
  type: string;
  dice: number;
  sides: number;
  mods: DiceMods;
  results: Record<string, number>[];
}

export interface DiceMods {
  customCrit?: [
    {
      comp: "<=" | "<" | ">" | ">=";
      point: number;
    }
  ];
  customFumble?: [
    {
      comp: "<=" | "<" | ">" | ">=";
      point: number;
    }
  ];
  [x: string]: any;
}

export interface IBackend {
  getCampaignList(): Promise<CampaignBasicInfos[]>;
  getDetailsOfCampaign(id: string): Promise<CampaignGeneralInfos | undefined>;
  getDetailsOfSession(
    campaignId: string,
    sessionId: string
  ): Promise<Session | undefined>;
}
