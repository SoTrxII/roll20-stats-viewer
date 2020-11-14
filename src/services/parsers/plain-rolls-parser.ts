import { IParsedRoll, IRollParser } from "@/@types/roll-parsing.service";
import { ChatMessage, PlainRollChatMessage } from "@/@types/backend.service";
import { injectable } from "inversify";

@injectable()
export class PlainRollsParser implements IRollParser {
  templateName = ["plain"];

  parse(message: ChatMessage): IParsedRoll | undefined {
    return {
      template: "plain",
      avatar: message.avatar,
      rollResult: message.content.total,
      rollType: "normal",
      timestamp: message[".priority"],
      who: message.who,
      playerId: message.playerid,
      rollString: (message as PlainRollChatMessage).origRoll,
      originalRolls: (message as PlainRollChatMessage).content.rolls,
    };
  }
}
