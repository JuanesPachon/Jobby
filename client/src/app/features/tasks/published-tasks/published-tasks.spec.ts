import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedTasks } from './published-tasks';

describe('PublishedTasks', () => {
  let component: PublishedTasks;
  let fixture: ComponentFixture<PublishedTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
