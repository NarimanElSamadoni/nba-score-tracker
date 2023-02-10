import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesResultsComponent } from './games-results/games-results.component';
import { TeamsComponent } from './teams.component';

const routes: Routes = [
  { path: '', component: TeamsComponent },
  { path: 'results/:teamCode', component: GamesResultsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
