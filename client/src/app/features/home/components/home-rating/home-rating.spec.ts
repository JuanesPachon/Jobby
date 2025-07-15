import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRating } from './home-rating';

describe('HomeRating', () => {
  let component: HomeRating;
  let fixture: ComponentFixture<HomeRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
