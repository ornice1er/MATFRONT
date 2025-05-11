import { TestBed } from '@angular/core/testing';

import { ReportTransmissionService } from './report-transmission.service';

describe('ReportTransmissionService', () => {
  let service: ReportTransmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportTransmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
