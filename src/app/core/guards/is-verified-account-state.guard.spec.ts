import { TestBed } from '@angular/core/testing';

import { IsVerifiedAccountStateGuard } from './is-verified-account-state.guard';

describe('IsVerifiedAccountStateGuard', () => {
  let guard: IsVerifiedAccountStateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsVerifiedAccountStateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
