import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExperiences } from './edit-experiences';

describe('EditExperiences', () => {
  let component: EditExperiences;
  let fixture: ComponentFixture<EditExperiences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExperiences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExperiences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
