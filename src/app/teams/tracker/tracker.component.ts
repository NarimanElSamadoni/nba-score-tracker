import { Component, OnInit } from '@angular/core';
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
  selectedTeams: Team[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.teamsList$.subscribe((data) => {
      if (data != null) {
        this.teams = data;
        this.dataLoaded = true;
      }
    });

    this.teamService.selectedTeams$.subscribe((result) => {
      this.selectedTeams = result;
    });
  }

  onClickTrackTeam() {
    let teamIndex = this.selectedTeams.findIndex(
      (team) => team.id == this.selectedTeam.id
    );

    if (teamIndex == -1) {
      this.teamService.getTeamGameResults(this.selectedTeam.id);
      this.teamService.addToSelectedTeamsArray(this.selectedTeam);
    }
  }
}
