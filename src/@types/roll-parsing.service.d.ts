import {
  ChatMessage,
  DiceResult,
  PlainRollChatMessage,
} from "@/@types/backend.service";

/**
 * The parsing service has many parser, each for every
 * roll template there is (or at least those I had the courage to implement).
 */
export interface IRollParsing {
  parse(message: ChatMessage): IParsedRoll | undefined;
}

export interface IRollParser {
  /**
   * Name of the templates, "callofcthulu", "dnd",
   */
  templateName: string[];

  parse(message: ChatMessage): IParsedRoll | undefined;
}

export interface IParsedRoll {
  /**
   * Template name used
   */
  template: string;
  /**
   * Skill used for the roll
   */
  skill?: string;
  /**
   * I have X in Strength
   */
  skillThreshold?: string;
  /**
   * Actual roll result
   */
  rollResult: string;
  /**
   * Roll type
   */
  rollType: "normal" | "critsuccess" | "critfailure";
  /**
   * Who rolled the dice
   */
  who: string;
  /**
   * Avatar of the dice roller
   */
  avatar: string;
  /**
   * Time the dices were rolled
   */
  timestamp: number;
  /**
   * Player local game ID
   */
  playerId: string;
  /**
   * dices rolled prettu printing
   */
  rollString: string;
  /**
   * All rolls as recognized by r20
   */
  originalRolls: DiceResult[];
}
