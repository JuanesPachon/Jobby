import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDocuments } from './edit-documents';

describe('EditDocuments', () => {
  let component: EditDocuments;
  let fixture: ComponentFixture<EditDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
