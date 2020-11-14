import { IParsedRoll, IRollParser } from "@/@types/roll-parsing.service";
import {
  ChatMessage,
  InlineRoll,
  PlainRollChatMessage,
  TemplateRollChatMessage,
} from "@/@types/backend.service";
import { injectable } from "inversify";

interface CthuluParsedTemplate {
  name: string;
  title: string;
  roll: InlineRoll;
  roll_target: InlineRoll;
  roll_difficulty: InlineRoll;
  roll_half: InlineRoll;
  roll_fifth: InlineRoll;
  roll_bonus: string;
}
@injectable()
export class CthuluRollsParser implements IRollParser {
  templateName = ["callofcthulhu"];

  parse(message: ChatMessage): IParsedRoll | undefined {
    const parsed = this.parseContent(message as TemplateRollChatMessage);
    // Roll20 templates can be buggy.
    // In the Cthulu 7e template, rolling an additional skill with a custom name can lead to
    // rolling nothing at all. Just in case that happens, better safe than sorry
    if (parsed.roll == undefined) {
      return undefined;
    }
    return {
      avatar: message.avatar,
      playerId: message.playerid,
      rollResult: parsed.roll.results.total,
      skill: parsed.title,
      who: parsed.name,
      template: "callofcthulhu",
      timestamp: message[".priority"],
      skillThreshold: parsed.roll_target.results.total,
      rollType: this.getRollType(Number(parsed.roll.results.total)),
      rollString: parsed.roll.expression,
      originalRolls: parsed.roll.results.rolls,
    };
  }

  getRollType(total: number) {
    if (total >= 95) return "critfailure";
    else if (total <= 5) return "critsuccess";
    else return "normal";
  }

  /**
   * Parse the template content to get usable values
   */
  private parseContent(message: TemplateRollChatMessage): CthuluParsedTemplate {
    /**
     * Example Cthulu 7e templater
     * "0  {{name=Lelo}} {{title=BALLS}} {{roll=$[[0]]}}
     * {{roll_target=$[[1]]}}{{roll_difficulty=$[[2]]}} {{roll_half=$[[3]]}}
     * {{roll_fifth=$[[4]]}} {{roll_fifth_1=$[[5]]}}
     * {{roll_bonus=[bonus / penalty](~-MILB8Qa1sPbr7n62qnF|bonus)}}"
     */
    const raw = message.content;
    /**
     * Search for all {{x=y}} groups, split them to have an [x,y][] array
     */
    const templateDetails = Array.from(raw.matchAll(/{{(.*?)}}/g)).map((ar) =>
      ar[1].split("=")
    );

    // Resolve all the parameters
    const parameterRegex = /\$\[\[(\d+)\]\]/;
    const parsedContent: Record<string, any> = {};
    templateDetails.forEach((ar) => {
      let value: any = ar[1];
      if (parameterRegex.test(value)) {
        const paramOffset = Number(value.match(parameterRegex)![1]);
        value = message.inlinerolls[paramOffset];
      }
      parsedContent[ar[0]] = value;
    });

    return parsedContent as CthuluParsedTemplate;
  }
}
