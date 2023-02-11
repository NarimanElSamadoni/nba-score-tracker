import { GameStatusEnum } from "../enums/game-status.enum";

export interface GameStatus {
  gameId: number;
  status: GameStatusEnum;
}