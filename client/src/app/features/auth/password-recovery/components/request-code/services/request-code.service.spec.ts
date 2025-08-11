import { TestBed } from '@angular/core/testing';

import { RequestCodeService } from './request-code.service';

describe('RequestCodeService', () => {
  let service: RequestCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

