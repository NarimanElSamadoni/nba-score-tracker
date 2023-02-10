import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { GameResult } from '../models/game-result.model';
import { GameStatus } from '../models/game-status.model';
import { TeamDetails } from '../models/team-details.model';
import { Team } from '../models/team.model';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  @Input() teamDetails!: TeamDetails;
  @Output() removeTeam: EventEmitter<Team> = new EventEmitter<Team>();

  removeTeamDetails(team: Team) {
    console.log(team);
    this.removeTeam.emit(team);
  }
}
