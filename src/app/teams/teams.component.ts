import { Component, OnInit } from '@angular/core';
import { Team } from './models/team.model';
import { TeamService } from './services/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  selectedTeams!: Team[];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getAllTeams();

    this.teamService.selectedTeams$.subscribe((result) => {
      this.selectedTeams = result;
    });
  }

  onRemoveTeam(team: Team) {
    this.teamService.removeFromSelectedTeamsArray(team);
  }
}
