import { TestBed } from '@angular/core/testing';

import { FeteService } from './fete.service';

describe('FeteService', () => {
  let service: FeteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
