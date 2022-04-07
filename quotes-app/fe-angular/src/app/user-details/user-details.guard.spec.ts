import { TestBed } from '@angular/core/testing';

import { UserDetailsGuard } from './user-details.guard';

describe('UserDetailsGuard', () => {
  let guard: UserDetailsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserDetailsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
