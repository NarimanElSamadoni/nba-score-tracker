import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStatusEnum } from '../enums/game-status.enum';
import { GameResult } from '../models/game-result.model';
import { GameStatus } from '../models/game-status.model';
import { TeamGameResults } from '../models/team-game-results.model';
import { Team } from '../models/team.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent implements OnInit {
  @Input() team!: Team;
  @Output() removeTeam: EventEmitter<Team> = new EventEmitter<Team>();
  teamGameResultsMap!: Map<number, TeamGameResults>;
  teamGameResuls!: TeamGameResults;
  totalNumberOfGames!: number;
  pointsScored: number = 0;
  pointsConceded: number = 0;
  gamesStatus: GameStatus[] = [];
  dataLoaded: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService.teamGameResults$.subscribe((result) => {
      this.teamGameResultsMap = result;
      if (this.teamGameResultsMap.size > 0) {
        let gameResults = this.teamGameResultsMap.get(this.team.id);
        if (gameResults != undefined) {
          this.teamGameResuls = gameResults;
          this.setTeamDetailsData();
          this.dataLoaded = true;
        }
      }
    });
  }

  setTeamDetailsData() {
    this.totalNumberOfGames = this.teamGameResuls.gameResults.length;
    this.clearTrackingData();
    this.calculateTeamGamesPoints(this.team.id);
  }

  clearTrackingData() {
    this.gamesStatus = [];
    this.pointsScored = 0;
    this.pointsConceded = 0;
  }

  calculateTeamGamesPoints(teamId: number) {
    this.teamGameResuls.gameResults.forEach((game: GameResult) => {
      if (game.home_team.id == teamId) {
        let status: GameStatusEnum =
          game.home_team_score > game.visitor_team_score
            ? GameStatusEnum.WIN
            : game.home_team_score < game.visitor_team_score
            ? GameStatusEnum.LOSS
            : GameStatusEnum.DRAW;
        this.gamesStatus.push({
          gameId: game.id,
          status,
        });
        this.pointsScored += game.home_team_score;
        this.pointsConceded += game.visitor_team_score;
      } else if (game.visitor_team.id == teamId) {
        let status: GameStatusEnum =
          game.visitor_team_score > game.home_team_score
            ? GameStatusEnum.WIN
            : game.visitor_team_score < game.home_team_score
            ? GameStatusEnum.LOSS
            : GameStatusEnum.DRAW;
        this.gamesStatus.push({
          gameId: game.id,
          status,
        });
        this.pointsScored += game.visitor_team_score;
        this.pointsConceded += game.home_team_score;
      }
    });
  }

  removeTeamDetails(team: Team) {
    this.removeTeam.emit(team);
  }

  onSeeGameResultsClick(team: Team) {
    this.router.navigate(['results', team.abbreviation], {
      relativeTo: this.route,
    });
  }

  get GameStatusEnum() {
    return GameStatusEnum;
  }
}
