import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TeamService } from '../services/team.service';

@Injectable({
  providedIn: 'root',
})
export class TeamsResolver implements Resolve<boolean> {
  constructor(private teamService: TeamService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.teamService.getAllTeams();
    return of(true);
  }
}
