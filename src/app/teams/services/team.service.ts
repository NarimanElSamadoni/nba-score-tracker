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
  readonly NUMBER_OF_DAYS = 12;
  readonly TODAY_DATE = new Date();

  teamsList: BehaviorSubject<Team[]> = new BehaviorSubject<
    Team[]
  >([]);
  teamsList$: Observable<Team[]> = this.teamsList.asObservable();

  teamGameResultsMap: Map<number, TeamGameResults> = new Map();
  teamGameResults: BehaviorSubject<Map<number, TeamGameResults>> =
    new BehaviorSubject(new Map());
  teamGameResults$: Observable<Map<number, TeamGameResults>> =
    this.teamGameResults.asObservable();

  selectedTeams: Team[] = [];
  selectedTeams$: Observable<Team[]> = of(this.selectedTeams);

  private readonly constructDateRangeString = Array.from(
    Array(this.NUMBER_OF_DAYS).keys()
  )
    .map((key) => {
      let date = new Date();
      date.setDate(this.TODAY_DATE.getDate() - key);
      return this.datePipe.transform(date, 'YYYY-MM-dd') || '';
    })
    .join('&dates[]=');

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getAllTeams(): void {
    if (this.teamsList.getValue().length == 0) {
      this.http
        .get<{ data: Team[]; meta: object }>(this.BASE_URL + 'teams')
        .subscribe({
          next: (result: { data: Team[]; meta: object }) => {
            this.teamsList.next(result.data);
          },
          error: (error) => {
            console.error('Something has went wrong! ', error);
          },
        });
    }
  }

  getTeamById(id: number): Observable<Team> {
    return this.http
      .get<Team>(this.BASE_URL + 'teams/' + id)
      .pipe((result) => result);
  }

  getTeamGameResults(teamId: number): void {
    let teamGameResult = this.teamGameResultsMap.get(teamId);
    if (
      !teamGameResult ||
      (teamGameResult &&
        teamGameResult.lastUpdated.getDay() != this.TODAY_DATE.getDay())
    ) {
      //'https://free-nba.p.rapidapi.com/games?page=0&dates[]=2022-11-25&dates[]=2022-11-26&dates[]=2022-11-27&dates[]=2022-11-28&dates[]=2022-11-29&dates[]=2022-11-30&dates[]=2022-12-01&dates[]=2022-12-02&dates[]=2022-12-03&dates[]=2022-12-04&dates[]=2022-12-05&dates[]=2022-12-06&per_page=12&team_ids[]=26',
      let params: string =
        '&team_ids[]=' + teamId + '&dates[]=' + this.constructDateRangeString;

      this.http
        .get<{ data: GameResult[]; meta: object }>(
          this.BASE_URL + 'games?' + params
        )
        .subscribe({
          next: (result: { data: GameResult[]; meta: object }) => {
            let teamGameResult: TeamGameResults = {
              gameResults: result.data,
              lastUpdated: this.TODAY_DATE,
            };
            this.teamGameResultsMap.set(teamId, teamGameResult);
            this.teamGameResults.next(this.teamGameResultsMap);
          },
          error: (error) => {
            console.error('Something has went wrong! ', error);
          },
        });
    }
  }

  addToSelectedTeamsArray(team: Team) {
    let index = this.selectedTeams.findIndex((t) => t.id == team.id);

    if (index == -1) {
      this.selectedTeams.push(team);
    }
  }

  removeFromSelectedTeamsArray(team: Team) {
    let index = this.selectedTeams.findIndex((t) => t.id == team.id);

    if (index > -1) {
      this.selectedTeams.splice(index, 1);
    }
  }
}
