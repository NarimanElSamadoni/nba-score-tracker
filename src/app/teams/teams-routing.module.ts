import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesResultsComponent } from './games-results/games-results.component';
import { TeamsResolver } from './resolvers/teams.resolver';
import { TeamsComponent } from './teams.component';

const routes: Routes = [
  { path: '', component: TeamsComponent },
  {
    path: 'results/:teamCode',
    component: GamesResultsComponent,
    resolve: {
      canResolve: TeamsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
