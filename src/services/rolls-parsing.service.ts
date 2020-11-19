import { injectable, multiInject } from "inversify";
import { TYPES } from "@/types";
import {
  IParsedRoll,
  IRollParser,
  IRollParsing,
} from "@/@types/roll-parsing.service";
import { ChatMessage, TemplateRollChatMessage } from "@/@types/backend.service";

@injectable()
export class RollsParsingService implements IRollParsing {
  constructor(@multiInject(TYPES.RollParser) private parsers: IRollParser[]) {}

  parse(message: ChatMessage): IParsedRoll | undefined {
    //If no template, it's a simple /r xdy roll
    if (!Object.prototype.hasOwnProperty.call(message, "rolltemplate")) {
      (message as TemplateRollChatMessage).rolltemplate = "plain";
    }
    // We're pretty much forced to abuse the casting mechanism to make this work
    // Why do text message have the same type as roll with a template ?
    const parser = this.parsers.find((p) =>
      p.templateName.includes(
        String((message as TemplateRollChatMessage).rolltemplate)
      )
    );

    return parser?.parse(message);
  }

  /**
   * Is this message a roll ?
   * Note: Should be static but you can't enforce static methods on interfaces
   * @param m
   */
  isARoll(m: ChatMessage): boolean {
    // A roll can be either:
    // - A plain roll -> /r 1d100
    // - A GM Roll -> /gmroll 1d100
    // - A template roll -> a cthulu roll. For some reason, a template roll is a general message
    return (
      m.type === "rollresult" ||
      m.type === "gmrollresult" ||
      (m.type === "general" &&
        Object.prototype.hasOwnProperty.call(m, "rolltemplate"))
    );
  }
}
