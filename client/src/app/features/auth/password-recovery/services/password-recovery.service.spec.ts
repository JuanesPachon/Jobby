import { TestBed } from '@angular/core/testing';

import { passwordRecoveryService } from './password-recovery.service';

describe('RequestCodeService', () => {
  let service: passwordRecoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(passwordRecoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

