import { GameResult } from "./game-result.model";
import { Team } from "./team.model";

export interface TeamGameResults {
  gameResults: GameResult[];
  lastUpdated: Date;
}