import { Team } from './team.model';

export interface GameResult {
  id: number;
  date: string;
  home_team: Team;
  home_team_score: number;
  visitor_team: Team;
  visitor_team_score: number
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
}