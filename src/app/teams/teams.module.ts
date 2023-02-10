import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { TrackerComponent } from './tracker/tracker.component';
import { TeamDetailsComponent } from './team-details/team-details.component';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { GamesResultsComponent } from './games-results/games-results.component';

@NgModule({
  declarations: [TeamsComponent, TrackerComponent, TeamDetailsComponent, GamesResultsComponent],
  imports: [
    CommonModule,
    FormsModule,
    TeamsRoutingModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    AvatarModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class TeamsModule {}
