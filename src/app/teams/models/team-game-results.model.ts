import { GameResult } from "./game-result.model";
import { Team } from "./team.model";

export interface TeamGameResults {
  team: Team | undefined;
  gameResults: GameResult[];
  lastUpdated: Date;
}