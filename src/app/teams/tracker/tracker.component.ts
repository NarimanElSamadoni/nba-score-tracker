import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameResult } from '../models/game-result.model';
import { GameStatus } from '../models/game-status.model';
import { TeamDetails } from '../models/team-details.model';
import { Team } from '../models/team.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam!: Team;
  dataLoaded: boolean = false;
  selectedTeams: TeamDetails[] = [];
  gameResults: GameResult[] = [];
  endDate: Date = new Date();
  datesRange: string[] = [];
  showTeamDetails: boolean = false;
  totalNumberOfGames!: number;
  pointsScored: number = 0;
  pointsConceded: number = 0;
  gamesStatus: GameStatus[] = [];
  disableTrackBtn: boolean = false;

  constructor(private teamService: TeamService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.selectedTeams = [];

    this.datesRange = Array.from(Array(12).keys()).map((key) => {
      let date = new Date();
      date.setDate(this.endDate.getDate() - key);
      return this.datePipe.transform(date, 'YYYY-MM-dd') || '';
    });

    this.teamService.getAllTeams().subscribe((data) => {
      this.teams = data;
      this.dataLoaded = true;
    });
  }

  onClickTrackTeam() {
    let teamIndex = this.selectedTeams.findIndex(
      (teamDetails) => teamDetails.team.id == this.selectedTeam.id
    );

    if (teamIndex == -1) {
      this.clearTrackingData();

      this.teamService
        .getTeamGameResults(this.selectedTeam.id, this.datesRange)
        .subscribe((result) => {
          this.gameResults = result;
          this.totalNumberOfGames = this.gameResults.length;
          this.calculatePoints(this.selectedTeam.id);
          this.selectedTeams.push({
            team: this.selectedTeam,
            totalNumberOfGames: this.totalNumberOfGames,
            pointsScored: this.pointsScored,
            pointsConceded: this.pointsConceded,
            gamesStatus: this.gamesStatus,
          });
          this.showTeamDetails = true;
        });
    }
  }

  clearTrackingData() {
    this.gamesStatus = [];
    this.pointsScored = 0;
    this.pointsConceded = 0;
  }

  calculatePoints(teamId: number) {
    this.gameResults.forEach((game: GameResult) => {
      if (game.home_team.id == teamId) {
        let status: 'W' | 'L' =
          game.home_team_score > game.visitor_team_score ? 'W' : 'L';
        this.gamesStatus.push({
          gameId: game.id,
          status,
        });
        this.pointsScored += game.home_team_score;
        this.pointsConceded += game.visitor_team_score;
      } else if (game.visitor_team.id == teamId) {
        let status: 'W' | 'L' =
          game.visitor_team_score > game.home_team_score ? 'W' : 'L';
        this.gamesStatus.push({
          gameId: game.id,
          status,
        });
        this.pointsScored += game.visitor_team_score;
        this.pointsConceded += game.home_team_score;
      }
    });
  }

  onRemoveTeam(team: Team) {
    this.selectedTeams = this.selectedTeams.filter(
      (teamDetails) => teamDetails.team.id != team.id
    );

    if (this.selectedTeams.length == 0)
      this.showTeamDetails = false;
  }
}
