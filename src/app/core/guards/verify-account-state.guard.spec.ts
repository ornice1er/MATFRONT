import { TestBed } from '@angular/core/testing';

import { VerifyAccountStateGuard } from './verify-account-state.guard';

describe('VerifyAccountStateGuard', () => {
  let guard: VerifyAccountStateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyAccountStateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
