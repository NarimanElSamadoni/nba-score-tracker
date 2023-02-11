import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameResult } from '../models/game-result.model';
import { Team } from '../models/team.model';
import { TeamService } from '../services/team.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-games-results',
  templateUrl: './games-results.component.html',
  styleUrls: ['./games-results.component.scss'],
})
export class GamesResultsComponent implements OnInit {
  teamId!: number;
  datesRange!: string[];
  gameResults: GameResult[] = [];
  team: Team | undefined = undefined;
  dataLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.teamId = params['teamCode'];

      this.teamService.getTeamById(this.teamId).subscribe(result => {
        this.team = result
        if (this.team)
          this.teamService.addToSelectedTeamsArray(this.team);
      });

      this.teamService.getTeamGameResults(Number(this.teamId));
    });

    this.teamService.teamGameResults$.subscribe((result) => {
      if (result.size > 0) {
        let teamGameResults = result.get(Number(this.teamId));
        if (teamGameResults != undefined) {
          this.gameResults = teamGameResults.gameResults;
          if (teamGameResults.team) this.team = teamGameResults.team;
          else {
            // this.getTeamFromGameResults();
          }
          this.dataLoaded = true;
        }
      }
    });
  }

  private getTeamFromGameResults() {
    let game = this.gameResults.find(
      (game) =>
        game.home_team.id == this.teamId || game.visitor_team.id == this.teamId
    );
    if (game) {
      if (game.home_team.id == this.teamId) this.team = game.home_team;
      else this.team = game.visitor_team;
    }
  }

  onNavigateBack() {

    this.location.back();
  }
}
