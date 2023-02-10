import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GameResult } from '../models/game-result.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  readonly BASE_URL = 'https://free-nba.p.rapidapi.com/';

  constructor(private http: HttpClient) {}

  getAllTeams(): Observable<Team[]> {
    return this.http
      .get<{ data: Team[]; meta: object }>(this.BASE_URL + 'teams')
      .pipe(map((result: { data: Team[]; meta: object }) => result.data));
  }

  getTeamGameResults(
    teamId: number,
    dates: string[]
  ): Observable<GameResult[]> {
    //'https://free-nba.p.rapidapi.com/games?page=0&dates[]=2022-11-25&dates[]=2022-11-26&dates[]=2022-11-27&dates[]=2022-11-28&dates[]=2022-11-29&dates[]=2022-11-30&dates[]=2022-12-01&dates[]=2022-12-02&dates[]=2022-12-03&dates[]=2022-12-04&dates[]=2022-12-05&dates[]=2022-12-06&per_page=12&team_ids[]=26',
    let params: string = '&team_ids[]=' + teamId;
    dates.forEach((d, i) => {
      params += '&dates[]=' + d;
    });

    return this.http
      .get<{ data: GameResult[]; meta: object }>(
        this.BASE_URL + 'games?' + params
      )
      .pipe(map((result: { data: GameResult[]; meta: object }) => result.data));
  }
}
