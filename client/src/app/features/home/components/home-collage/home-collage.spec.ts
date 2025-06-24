import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCollage } from './home-collage';

describe('HomeCollage', () => {
  let component: HomeCollage;
  let fixture: ComponentFixture<HomeCollage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCollage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCollage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
