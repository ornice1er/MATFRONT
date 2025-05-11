import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CspReportOwnComponent } from './csp-report-own.component';

describe('CspReportOwnComponent', () => {
  let component: CspReportOwnComponent;
  let fixture: ComponentFixture<CspReportOwnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CspReportOwnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CspReportOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
