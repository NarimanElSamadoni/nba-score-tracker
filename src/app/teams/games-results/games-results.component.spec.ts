import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesResultsComponent } from './games-results.component';

describe('GamesResultsComponent', () => {
  let component: GamesResultsComponent;
  let fixture: ComponentFixture<GamesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
