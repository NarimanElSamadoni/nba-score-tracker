import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GameResult } from '../models/game-result.model';
import { TeamGameResults } from '../models/team-game-results.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  readonly BASE_URL = 'https://free-nba.p.rapidapi.com/';

  teamsList: BehaviorSubject<Team[] | null> = new BehaviorSubject<
    Team[] | null
  >(null);
  teamsList$: Observable<Team[] | null> = this.teamsList.asObservable();

  teamGameResultsMap: Map<number, TeamGameResults> = new Map();
  teamGameResults: BehaviorSubject<Map<number, TeamGameResults>> =
    new BehaviorSubject(new Map());
  teamGameResults$: Observable<Map<number, TeamGameResults>> =
    this.teamGameResults.asObservable();

  selectedTeams: Team[] = [];
  selectedTeams$: Observable<Team[]> = of(this.selectedTeams);

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getAllTeams(): Observable<Team[] | null> {
    if (this.teamsList.getValue() == null) {
      this.http
        .get<{ data: Team[]; meta: object }>(this.BASE_URL + 'teams')
        .subscribe((result: { data: Team[]; meta: object }) => {
          this.teamsList.next(result.data);
        });
    }
    return this.teamsList$;
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(this.BASE_URL + 'teams/' + id).pipe(result => result);
  }

  getTeamGameResults(teamId: number): Observable<Map<number, TeamGameResults>> {
    let teamGameResult = this.teamGameResultsMap.get(teamId);
    if (
      !teamGameResult ||
      (teamGameResult &&
        teamGameResult.lastUpdated.getDay() != new Date().getDay())
    ) {
      let dates = Array.from(Array(12).keys()).map((key) => {
        let date = new Date();
        date.setDate(new Date().getDate() - key);
        return this.datePipe.transform(date, 'YYYY-MM-dd') || '';
      });

      //'https://free-nba.p.rapidapi.com/games?page=0&dates[]=2022-11-25&dates[]=2022-11-26&dates[]=2022-11-27&dates[]=2022-11-28&dates[]=2022-11-29&dates[]=2022-11-30&dates[]=2022-12-01&dates[]=2022-12-02&dates[]=2022-12-03&dates[]=2022-12-04&dates[]=2022-12-05&dates[]=2022-12-06&per_page=12&team_ids[]=26',
      let params: string = '&team_ids[]=' + teamId;
      dates.forEach((d, i) => {
        params += '&dates[]=' + d;
      });

      this.http
        .get<{ data: GameResult[]; meta: object }>(
          this.BASE_URL + 'games?' + params
        )
        .subscribe((result: { data: GameResult[]; meta: object }) => {
          let teamGameResult: TeamGameResults = {
            team: this.selectedTeams.find((t) => t.id == teamId),
            gameResults: result.data,
            lastUpdated: new Date(),
          };
          this.teamGameResultsMap.set(teamId, teamGameResult);
          this.teamGameResults.next(this.teamGameResultsMap);
        });
    }
    return this.teamGameResults$;
  }

  addToSelectedTeams(team: Team) {
    this.selectedTeams.push(team);
  }

  removeFromSelectedTeams(team: Team) {
    let index = this.selectedTeams.findIndex((t) => t.id == team.id);

    if (index > -1) {
      this.selectedTeams.splice(index, 1);
    }
  }
}
