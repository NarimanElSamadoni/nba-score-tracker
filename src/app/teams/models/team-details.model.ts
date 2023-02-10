import { GameStatus } from "./game-status.model";
import { Team } from "./team.model";

export interface TeamDetails {
  team: Team;
  totalNumberOfGames: number;
  pointsScored: number;
  pointsConceded: number;
  gamesStatus: GameStatus[];
}