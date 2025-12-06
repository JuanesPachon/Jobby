import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedTaskDetail } from './published-task-detail';

describe('PublishedTaskDetail', () => {
  let component: PublishedTaskDetail;
  let fixture: ComponentFixture<PublishedTaskDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedTaskDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedTaskDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
