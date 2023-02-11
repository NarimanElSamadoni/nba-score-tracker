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
  teamCode!: string;
  datesRange!: string[];
  gameResults: GameResult[] = [];
  team!: Team;
  dataLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.teamCode = params['teamCode'];

      this.teamService.teamsList$.subscribe({
        next: (result) => {
          let team = result.find(t => t.abbreviation == this.teamCode);
          if (team) {
            this.team = team;
            this.teamService.addToSelectedTeamsArray(this.team);
            this.teamService.getTeamGameResults(this.team.id);
          }
        },
        error: (error) => {
          console.error('Something has went wrong! ', error);
        },
      });
    });

    this.teamService.teamGameResults$.subscribe({
      next: (result) => {
        if (result.size > 0) {
          let teamGameResults = result.get(this.team.id);
          if (teamGameResults != undefined) {
            this.gameResults = teamGameResults.gameResults;
            this.dataLoaded = true;
          }
        }
      },
      error: (error) => {
        console.error('Something has went wrong! ', error);
      },
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
