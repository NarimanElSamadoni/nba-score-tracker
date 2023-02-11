import { TestBed } from '@angular/core/testing';

import { TeamsResolver } from './teams.resolver';

describe('TeamsResolver', () => {
  let resolver: TeamsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TeamsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
