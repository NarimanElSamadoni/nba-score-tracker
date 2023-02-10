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
      // this.teamService.getTeamGameResults(Number(this.teamId));
    });

    this.teamService.teamGameResults$.subscribe((result) => {
      if (result.size > 0) {
        let teamGameResults = result.get(Number(this.teamId));
        if (teamGameResults != undefined) {
          this.gameResults = teamGameResults.gameResults;
          // if (teamGameResults.team)
            this.team = teamGameResults.team;
          // else {
          //   this.teamService.getTeamById(this.teamId).subscribe(result => this.team = result);
          // }
          this.dataLoaded = true;
        }
      }
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
