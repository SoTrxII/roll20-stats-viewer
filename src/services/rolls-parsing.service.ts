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
}
