import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksResult } from './tasks-result';

describe('TasksResult', () => {
  let component: TasksResult;
  let fixture: ComponentFixture<TasksResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
