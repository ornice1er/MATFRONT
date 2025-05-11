import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CspReportPendingComponent } from './csp-report-pending.component';

describe('CspReportPendingComponent', () => {
  let component: CspReportPendingComponent;
  let fixture: ComponentFixture<CspReportPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CspReportPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CspReportPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
