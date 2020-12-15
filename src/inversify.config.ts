import { Container } from "inversify";
import { IAuthService } from "@/@types/auth.service";
import { TYPES } from "@/types";
import { BackendService } from "@/services/backend.service";
import { IBackend } from "@/@types/backend.service";
import { BackendServiceMock } from "@/services/mocks/backend.service.mock";
import { IRollParser, IRollParsing } from "@/@types/roll-parsing.service";
import { RollsParsingService } from "@/services/rolls-parsing.service";
import { PlainRollsParser } from "@/services/parsers/plain-rolls-parser";
import { CthuluRollsParser } from "@/services/parsers/cthulu-rolls-parser";
console.log(process.env.VUE_APP_BACKEND_URL);

export const container = new Container();

/*container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();*/

//container.bind<IBackend>(TYPES.BackendService).to(BackendServiceMock);
container
  .bind<IBackend>(TYPES.BackendService)
  .toConstantValue(new BackendService(process.env.VUE_APP_BACKEND_URL));

container.bind<IRollParsing>(TYPES.RollParsingService).to(RollsParsingService);
//Register all dice parsers
container.bind<IRollParser>(TYPES.RollParser).to(PlainRollsParser);
container.bind<IRollParser>(TYPES.RollParser).to(CthuluRollsParser);
